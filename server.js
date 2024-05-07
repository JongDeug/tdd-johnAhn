require('dotenv').config();
// 통합 테스트를 위해 해놨
const express = require('express');
const app = express();
// router 가져오기
const productRoutes = require('./router');
const mongoose = require('mongoose');


const PORT = 8000;

// POST 요청 시 req.body 부분을 받으려면
// bodyParser 모듈을 이용해 해결해야 한다.
// 하지만 express 버전 4.16.0 부터는
// 내장 미들웨어인 express.json() 을 사용하면 된다.
// Content-type: json
app.use(express.json());
// Content-type: x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);

// 에러 처리법
// app.use('/', (req, res, next) => {
//     // 1. 이렇게 동기로 던지면 에러 핸들링 잘됨.
//     // throw new Error('동기: 에러다 이놈아');
//     // 2. 비동기로 던지면 에러 핸들링 안됨. 핸들러가 못받아서 서버 중단됨
//     // setImmediate(() => {
//     //     throw new Error('비동기: 에러다 이놈아');
//     // });
//     // 3. 비동기인데 next로 넘기면 잘됨
//     setImmediate(() => {
//         next(Error('에러다 이놈아'));
//     });
// });

// 커스텀 에러 핸들러. => 디폴트도 있긴함!!
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});

const server = app.listen(PORT, async () => {
    await mongoose.connect('mongodb://localhost:27017/products', {
        authSource: 'admin',
        user: process.env['DB_ID'],
        pass: process.env['DB_PASS'],
    }).then().catch(err => console.log(err));

    // console.log('Running on port: ' + PORT);
});
// supertest 용
module.exports = { app, server };
