import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);

app.get('/',(req,res)=>{
    res.json({message:"Welcome to the Preplexity Clone API!"});
})




export default app