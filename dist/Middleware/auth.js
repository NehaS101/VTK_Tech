"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usermodel_1 = __importDefault(require("../Model/usermodel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.secret_key || '');
    }
    catch (error) {
        return null;
    }
};
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send('Access Denied');
    }
    const decodedUser = verifyToken(token);
    if (!decodedUser) {
        return res.status(400).send('Invalid Token');
    }
    try {
        const user = await usermodel_1.default.findById(decodedUser.id);
        if (!user) {
            return res.status(400).send('User not found');
        }
        req.user = {
            id: user._id,
            roles: user.roles,
        };
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
};
exports.default = authenticate;
