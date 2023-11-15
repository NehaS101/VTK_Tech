import express,{Request, Response} from 'express';
import authenticate from '../Middleware/auth';
import Book from '../Model/bookmodel';

const router = express.Router();

router.post('/books',async (req:Request, res:Response) => {
    try {
        const {title} = req.body;
        const book = new Book({title});
        await book.save();
    } catch (error) {
        console.log(error);
        res.send('Error: ' + error);
    }
})

router.get('/books',async (req:Request, res:Response)=>{
    try {
        const userId = req.user.id;
        const books = await Book.find({createdBy:userId});
        res.json(books);
    } catch (error) {
        console.log(error);
        res.send('Error: ' + error);
    }
})

router.get('/books',async (req:Request, res:Response)=>{
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        console.log(error);
        res.send('Error: ' + error);
    }
})


export default router