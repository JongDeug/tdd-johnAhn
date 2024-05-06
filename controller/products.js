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

