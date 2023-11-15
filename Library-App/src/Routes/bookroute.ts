import express,{Request, Response} from 'express';
import authenticate from '../Middleware/auth';
import Book from '../Model/bookmodel';

const router = express.Router();

router.post('/books',authenticate,async (req:Request, res:Response) => {
    try {
        const {title} = req.body;
        const book = new Book({title});
        await book.save();
    } catch (error) {
        console.log(error);
        res.send('Error: ' + error);
    }
})

router.get('/books',authenticate,async (req:Request, res:Response)=>{
    const { user } = req;

  try {
    if (user.roles.includes('VIEWER')) {
      const books = await Book.find({ createdBy: user.id });
      return res.json(books);
    } else if (user.roles.includes('VIEW_ALL')) {
      const books = await Book.find();
      return res.json(books);
    } else {
      return res.status(403).send('You do not have the required role.');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
})

router.get('/books', authenticate, async (req: Request, res: Response) => {
  const { user } = req;

  try {
    const { old, new: isNew } = req.query;

    if (old === '1') {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const oldBooks = await Book.find({ createdAt: { $lte: tenMinutesAgo } });
      return res.status(200).json(oldBooks);
    } else if (isNew === '1') {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const newBooks = await Book.find({ createdAt: { $gte: tenMinutesAgo } });
      return res.status(200).json(newBooks);
    }

    // If no filtering is requested, return all books
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }
});



export default router