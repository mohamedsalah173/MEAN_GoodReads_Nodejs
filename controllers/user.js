/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const { query } = require('express');
const User = require('../models/User');

const create = (req, res, next) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });
    if (user.save()) {
        res.json(user);
    } else {
        res.json(error.message);
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().exec();
        res.json(users);
    } catch (error) {
        res.json(error);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.json(error.message);
    }
};

const updateUserById = async (req, res) => {
    try {
        const { body: { firstName, lastName, email } } = req;
        const user = await User.findByIdAndUpdate(req.params.id, { firstName, lastName, email });
        res.json(user);
    } catch (error) {
        res.json(error.message);
    }
};

module.exports = {
    create,
    getAllUsers,
    getUserById,
    updateUserById,
};
