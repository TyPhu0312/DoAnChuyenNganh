
const Product = require('../models/Product');
const getProducts = async(req,res)=> {
    try {
        const Product = await Product.find({});
        res.stauts(200).json(Product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
const getProductsById = async(req,res)=> {
    try {
        const {id} = req.params;
        const Product = await Product.findById(id);
        res.stauts(200).json(Product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
const createProduct = async(req,res)=> {
    try {
        const Product = await Product.create(req.body);
        res.stauts(200).json(Product);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const updateProduct = async(req,res)=> {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        if(!product) {
            res.stauts(404).json({message:"Không tìm thấy sản phẩm này"});
        }
        const updatedProduct = await Product.findById(id);
        res.stauts(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};


const deleteProduct = async(req,res)=> {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id, req.body);
        if(!product) {
            res.stauts(404).json({message:"Không tìm thấy sản phẩm này!"});
        }
        res.stauts(200).json({message: "Xoá thành công!"});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
module.exports = { getProducts, getProductsById, createProduct, updateProduct, deleteProduct };