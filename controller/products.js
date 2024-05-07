// exports.hello = (req, res) => {
//     res.send('hello world');
// };
const productModel = require('../models/Product');

exports.createProduct = async (req, res, next) => {
    try {
        const createdProduct = await productModel.create(req.body);
        // console.log(createdProduct);
        res.status(201).json(createdProduct);
    } catch (error) {
        // console.log(error)
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const allProducts = await productModel.find({});
        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.productId);

        if (!product) {
            res.status(404).send();
            return;
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};
