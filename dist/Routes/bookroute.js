"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../Middleware/auth"));
const bookmodel_1 = __importDefault(require("../Model/bookmodel"));
const router = express_1.default.Router();
router.post('/books', auth_1.default, async (req, res) => {
    const { user } = req;
    try {
        if (user.roles.includes('CREATOR')) {
            const { title } = req.body;
            const book = new bookmodel_1.default({ title, createdBy: req.user.id });
            await book.save();
            res.status(201).json(book);
        }
        else {
            return res.status(403).send('You do not have the required role.');
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});
router.get('/books', auth_1.default, async (req, res) => {
    const { user } = req;
    try {
        if (user.roles.includes('VIEWER')) {
            const books = await bookmodel_1.default.find({ createdBy: user.id });
            return res.json(books);
        }
        else if (user.roles.includes('VIEW_ALL')) {
            const books = await bookmodel_1.default.find();
            return res.json(books);
        }
        else {
            return res.status(403).send('You do not have the required role.');
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});
router.get('/books', auth_1.default, async (req, res) => {
    const { user } = req;
    try {
        const { old, new: isNew } = req.query;
        if (old === '1') {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            const oldBooks = await bookmodel_1.default.find({ createdAt: { $lte: tenMinutesAgo } });
            return res.status(200).json(oldBooks);
        }
        else if (isNew === '1') {
            const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
            const newBooks = await bookmodel_1.default.find({ createdAt: { $gte: tenMinutesAgo } });
            return res.status(200).json(newBooks);
        }
        const books = await bookmodel_1.default.find();
        res.status(200).json(books);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error');
    }
});
exports.default = router;
