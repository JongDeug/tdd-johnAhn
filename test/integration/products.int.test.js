const request = require('supertest');
const { app, server } = require('../../server');
const newProducts = require('../data/new-product.json');
const newProductsError = require('../data/new-product-err.json');
const mongoose = require('mongoose');

describe('Integration Test', () => {

    // 캬 깔끔!!
    afterAll(async () => {
        await mongoose.connection.close();
        server.close();
    });

    it('POST /api/products', async () => {
        const response = await request(app)
            .post('/api/products')
            .send(newProducts);
        expect(response.statusCode).toBe(201);
        expect(response.body.name).toBe(newProducts.name);
        expect(response.body.description).toBe(newProducts.description);
        expect(response.body.price).toBe(newProducts.price);
    });

    it('should return 500 on POST /api/products', async () => {
        const response = await request(app)
            .post('/api/products')
            .send(newProductsError);
        expect(response.statusCode).toBe(500);
        // console.log('response.', response.body);
        // express 에서 비동기 요청 기본 default 에러 핸들러가 있다. 문서를 참고하면 res.render('error', { error: err }) 이렇게 보여줌. render 이기 때문에 값을
        // 따로 받기 힘듦. 그래서 그냥 app.use 에서 커스텀 에러 핸들러를 만들어서 사용한 것임
        expect(response.body).toStrictEqual({ message: 'Product validation failed: description: Path `description` is required.' });
    });
});