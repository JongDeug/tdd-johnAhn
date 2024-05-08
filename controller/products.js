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

exports.updateProduct = async (req, res, next) => {
    try {
        const updateProduct = await productModel.findByIdAndUpdate(req.params.productId, req.body, { new: true });

        if (!updateProduct) {
            res.status(404).send({ message: 'id doesnt exist' });
            return;
        }

        res.status(200).json(updateProduct);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.productId);

        if (!deletedProduct) {
            res.status(404).send();
            return;
        }
        res.status(200).json(deletedProduct);
    } catch (error) {
        next(error);
    }
};
