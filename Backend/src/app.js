import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
// routes 
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';



const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/chats', chatRouter);


app.get('/',(req,res)=>{
    res.json({message:"Welcome to the Preplexity Clone API!"});
})




export default app
