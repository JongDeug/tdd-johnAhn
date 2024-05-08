const request = require('supertest');
const { app, server } = require('../../server');
const newProducts = require('../data/new-product.json');
const newProductsError = require('../data/new-product-err.json');
const updateProduct = require('../data/update-product.json');
const mongoose = require('mongoose');

let firstProduct = null;
const wrongId = '66387b4686bb893c18e94abf';

// 통합 테스트는 서버를 굳이 시작하지 않아도 됨
// + DB는 켜져있어야 함!!
// 단위 테스트는 DB가 잘된다고 가정하고 테스트함
// 통합 테스트는 실제 DB값을 사용함
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

    it('GET /api/products', async () => {
        const response = await request(app)
            .get('/api/products');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        // toBeDefined 변수가 undefined인지 아닌지 확인하는거
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].description).toBeDefined();
        firstProduct = response.body[0];
    });

    it('GET /api/products/:productId', async () => {
        const response = await request(app)
            .get(`/api/products/${firstProduct._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(firstProduct.name);
        expect(response.body.description).toBe(firstProduct.description);
    });

    it('GET id doesnt exist /api/products/:productId', async () => {
        // 유호하지 않은 produdct id!!
        const response = await request(app).get(`/api/products/${wrongId}`);
        expect(response.statusCode).toBe(404);
    });

    it('PUT /api/products/:productId', async () => {
        const response = await request(app)
            .put(`/api/products/${firstProduct._id}`)
            .send(updateProduct);

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updateProduct.name);
        expect(response.body.description).toBe(updateProduct.description);
        expect(response.body.price).toBe(updateProduct.price);
    });

    it('should return 404 on PUT /api/products/:productId', async () => {
        const response = await request(app)
            .put(`/api/products/${wrongId}`)
            .send(updateProduct);

        // console.log(response.body);
        expect(response.statusCode).toBe(404);
        expect(response.body).toStrictEqual({ message: 'id doesnt exist' });
    });

    it('DELETE /api/products/:productId', async () => {
        const response = await request(app)
            .delete(`/api/products/${firstProduct._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(updateProduct.name);
        expect(response.body.description).toBe(updateProduct.description);
        expect(response.body.price).toBe(updateProduct.price);
    });

    it('should return 404 on DELETE /api/products/:productId', async () => {
        const response = await request(app)
            .delete(`/api/products/${wrongId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toBeDefined();
    })
});