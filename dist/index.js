"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const bookroute_1 = __importDefault(require("./Routes/bookroute"));
const userroutes_1 = __importDefault(require("./Routes/userroutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', bookroute_1.default);
app.use('/api', userroutes_1.default);
app.get('/', (req, res) => {
    res.send('wecome to library app');
});
app.listen(process.env.Port, async () => {
    console.log("server listening on port " + process.env.Port);
    try {
        await config_1.default;
        console.log('connected to db');
    }
    catch (error) {
        console.log("server error: " + error);
    }
});
