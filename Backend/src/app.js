import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import morgan from 'morgan';



const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);

app.get('/',(req,res)=>{
    res.json({message:"Welcome to the Preplexity Clone API!"});
})




export default app
