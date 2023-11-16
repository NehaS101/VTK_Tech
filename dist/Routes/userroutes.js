"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usermodel_1 = __importDefault(require("../Model/usermodel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRouter = express_1.default.Router();
userRouter.post('/register', async (req, res) => {
    try {
        const { username, password, roles } = req.body;
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new usermodel_1.default({ username, password: hashedPassword, roles });
        await newUser.save();
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await usermodel_1.default.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.roles }, process.env.secret_key || '', {
            expiresIn: '1d',
        });
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
exports.default = userRouter;
