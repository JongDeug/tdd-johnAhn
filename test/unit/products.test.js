const productController = require('../../controller/products');
const productModel = require('../../models/Product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');
const allProduct = require('../data/all-products.json');

// jest.fn() 를 이용해서 가짜 함수를 생성 하므로 인해서 의존적인 부분으로 인해 영향을 받는 테스트 상황을 해결할 수 있습니다. 이 jest.fn()이 생성한 가짜 함수는 이 함수에 어떤 일들이 발생했는지, 다른 코드 들에 의해서 어떻게 호출되는지를 기억하기 때문에 이 함수가 내부적으로 어떻 게 사용되는지 검증할 수도 있습니다. (Spy 역할)
productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();

const productId = '123123515523';
let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe('Product Controller Create', () => {
    // 이 block에만 적용됨
    beforeEach(() => {
        req.body = newProduct;
    });

    // test or it
    it('should have a createProduct function', () => {
        expect(typeof productController.createProduct).toBe('function');
    });

    it('should call ProductModel.create', () => {
        productController.createProduct(req, res, next);
        // 단위 테스트이기 때문에 직접적으로 모델에 영향을 받으면 안됨.
        expect(productModel.create).toBeCalledWith(newProduct);
    });

    it('should return 201 response code', async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toEqual(201);
        // expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return json body in response', async () => {
        productModel.create.mockReturnValue(newProduct); // 순서가 중요함. 얘가 두 번째에 있으면 에러나네
        await productController.createProduct(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    // 몽고 디비에서 처리하는 부분은 잘되고 있다고 가정하고 하는 단위 테스트임
    // 그래서 몽고 디비에서 처리하는 에러 미시지 부분은 Mock 함수를 이용해서 처리해야한다.
    it('should handle errors', async () => {
        const errorMessage = { message: 'description property missing' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        // Express에서 비동기 요청해 대한 에러는 처리해주지 않음. 서버가 망가진다.
        // 처리하려면 next를 사용해야 함.
        // next => mock 함수 이용
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('Product Controller Get', () => {
    it('should have a getProducts function', () => {
        expect(typeof productController.getProducts).toBe('function');
    });

    it('should call ProductModel.find({})', async () => {
        await productController.getProducts(req, res, next);
        // toBeCalledWith === toHaveBeenCalledWith
        expect(productModel.find).toHaveBeenCalledWith({});
    });

    it('should return 200 response', async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should return json body in response', async () => {
        productModel.find.mockReturnValue(allProduct);
        await productController.getProducts(req, res, next);
        // res.send()면 오류나지!
        expect(res._getJSONData()).toStrictEqual(allProduct);
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'Error finding product data' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe('Product Controller GetById', () => {
    it('should have a getProductById', () => {
        expect(typeof productController.getProductById).toBe('function');
    });

    it('should call ProductModel.findById', async () => {
        req.params.productId = productId;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    });

    it('should return response code 200 and json body in response', async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    it('should return 404 when item doesnt exist', async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it('should handle errors', async () => {
        const errorMessage = { message: 'error' };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});