const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user  = await User.findById(id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        if (!user) {
            return res.status(404).json('Không tìm thấy user này!');
        }
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);  
        if (!user) {
            return res.status(404).json('Không tìm thấy user này!');
        }
        res.status(200).json('Xoá user thành công');
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { getUsers, getUserById, getUserInfo, updateUser, deleteUser };