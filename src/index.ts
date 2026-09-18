import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { request } from 'node:http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
interface Patient{
  name:string,
  age:number,
  place:string
}
let patients:Patient[]=[{
  name:"varun",
  age:21,
  place:"ckm"

},{
  name:"chandan",
  age:20,
  place:"mysore"
}]
app.get("/patients",(req:Request,res:Response)=>{
res.send(patients)
})
// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

export default app;
export { app };
