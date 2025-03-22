import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';


const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRouter);
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
