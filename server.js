require('dotenv').config();
const express = require('express');
const app = express();
// router 가져오기
const productRoutes = require('./router');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/products', {
    authSource: 'admin',
    user: process.env['DB_ID'],
    pass: process.env['DB_PASS'],
}).catch(err => console.log(err));

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

app.listen(PORT, () => console.log('Running on port: ' + PORT));