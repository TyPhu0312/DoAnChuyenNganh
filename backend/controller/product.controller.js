const Product = require('../models/Product');
const dbConnect = require('../database/db')
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
        let title = req.body.title;
        let author = req.body.author;
        let price = req.body.price;
        if(title.length === 0 || author.length === 0 || price === 0) {
            errors = true;
            // set flash message
            req.flash('error', "Not enough information");
            // render to add.ejs with flash message
            res.render('admin/products', {
                name: title,
                author: author,
                price: price
            })
        //const Product = await Product.create(req.body);
        res.stauts(200).json(Product);
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
    if(!errors) {
        var form_data = {
            name: title,
            author: author,
            price: price
        }
        // insert query
        dbConnect.query('INSERT INTO product SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // render to add.ejs
                res.render('admin/products', {
                    name: form_data.name,
                    author: form_data.author,
                    price: form_data.price
                })
            } else {
                req.flash('success', 'product successfully added');
                res.redirect('admin/products');
            }
        })
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