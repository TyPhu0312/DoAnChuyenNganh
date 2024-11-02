const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bycrypt = require('bycrypt');

require('dotenv').config();

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message:'User không tồn tại'});
        }
        const isMatch = await user.comparePassword(password);
        if(isMatch === false) {
            return res.status(401).json({ message: 'Sai mật khẩu' });
        }
        let tokenData={_id:user._id, email:user.email, role:user.role}
        const token = jwt.sign(tokenData, process.env.JWT_SECRECT, {expiresIn:'30p'});
        res.status(200).json({ status: true, token: token, success: "Đăng nhập thành công!", user });
    } catch (error) {
        next(error);
    }
}

const adminLogin = async(req,res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message:'User không tồn tại'});
        }
        const isMatch = await user.comparePassword(password);
        if(isMatch === false) {
            return res.status(401).json({ message: 'Sai mật khẩu' });
        }
        if(user.role === 'admin') {
            let tokenData={_id:user._id, email:user.email, role:user.role}
            const token = jwt.sign(tokenData, process.env.JWT_SECRECT, {expiresIn:'1h'});
            res.status(200).json({ status: true, token: token, success: "Đã đăng nhập với tư cách admin!", user });
        }
        else {
            res.status(401).json({ message: 'Truy cập bị từ chối do không có quyền!' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Không có admin này' });;
    }
}

const register = async (req,res) => {
    try {
        const {nameProfile, email, password, role} = req.body;
        const user = new User({nameProfile, email, password, role});
        await user.save();
        res.status(200).json({message: "Đăng ký thành công"});
    } catch (error) {
        res.status(500).json({message: "Đăng ký thất bại"})
    }
}

const logout = async(req,res)=> {
    try {
        res.status(200).json({ status: true, success: "Đăng xuất thành công" });
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

module.exports = { register, login, adminLogin, logout };