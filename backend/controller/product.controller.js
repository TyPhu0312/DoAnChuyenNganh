
const dbConnect = require('../database/db')

//hàm chuyển những query về thành promsise function
const queryAsync = (sql, params = []) => { 
    return new Promise((resolve, reject) => {
        dbConnect.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};
const getProducts = async(req,res)=> {
    try {
        const data = await queryAsync('SELECT * FROM qlbantranh.product'); //
        if(!data) {
            return res.status(404).send({
                success:false,
                message:"No record found"
            })
        }
        res.status(200).send({
            success:true,
            message:'All Product here',
            data: data,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message:'Error in get api',
            error: error,
        })
    }
};
const getProductById = async(req,res)=> {
    try {
        const {id} = req.params; //lấy id từ tham số truyền vào ngoài routes ở product/id
        if(!id){
            return res.status(404).send({
                success:false,
                message: 'Invalid Product ID!'
            })
        }
        const dataWithId = await queryAsync(`SELECT * FROM qlbantranh.product WHERE id =?`,[id]);
        if(!dataWithId) {
            return res.status(404).send({
                success: false,
                message:'No record found',
            });
        }    
        res.status(200).send({
            success: true,
            ProductDetail: dataWithId
        })
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
const createProduct = async (req, res) => {
    try {
        const { title, author, price, thumbnail, description, categoryId } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!title || !categoryId || !author || !price) {
            return res.status(400).send({
                success: false,
                message: "Thiếu trường thông tin bắt buộc",
            });
        }

        // Thực hiện câu truy vấn INSERT
        const data = await queryAsync(
            `INSERT INTO product (title, author, price, thumbnail, description, categoryId) VALUES (?, ?, ?, ?, ?, ?)`,
            [title, author, price, thumbnail, description, categoryId]
        );

        // Kiểm tra kết quả
        if (!data) {
            console.log("Không đủ dữ liệu để INSERT hoặc nhập sai dữ liệu");
            return res.status(500).send({
                success: false,
                message: 'Lỗi trong câu truy vấn INSERT',
            });
        }

        res.status(201).send({
            success: true,
            message: 'Sản phẩm đã được tạo thành công!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Lỗi trong yêu cầu API tạo sản phẩm',
            error,
        });
    }
};


const updateProduct = async(req,res)=> {
    const { id } = req.params;
    const { title, author, price, category, description } = req.body;
    dbConnect.query(`UPDATE product SET title='${title}', author='${author}', price='${price}', categoryId='${category}', description='${description}' WHERE id='${id}'`, function (err) {
        if (err) throw err;
        res.status(200).json({ message: "Product updated successfully" });
    });
};


const deleteProduct = async(req,res)=> {
    const { id } = req.params;
    dbConnect.query(`DELETE FROM product WHERE id='${id}'`, function (err) {
        if (err) throw err;
        res.status(200).json({ message: "Product deleted successfully" });
    });
};
module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };