import express, {Request, Response} from 'express';
import User from '../Model/usermodel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRouter = express.Router();

userRouter.post('/register', async (req: Request, res: Response) => {
    try {
      const { username, password, roles } = req.body;
  
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ username, password: hashedPassword, roles });
      await newUser.save();
  
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  userRouter.post('/login', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
  
      // Find the user by username
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(401).send('Invalid credentials');
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).send('Invalid credentials');
      }
  
      // Generate a JWT token for authentication
      const token = jwt.sign({ id: user._id, role: user.roles }, process.env.secret_key || '', {
        expiresIn: '1d', // Token expires in 1 hour (adjust as needed)
      });
  
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

export default userRouter;