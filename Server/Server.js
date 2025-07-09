import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Todo from './Schema/todoSchema.js';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

// Database
mongoose.connect(`${process.env.MONGODB_URL}/mern-todo`)
        .then(() => console.log('Database Connected'))
        .catch(() => console.log('Database Not Connected'));

// Cors
const allowedOrigins = ["https://mern-todo-app-frontend.netlify.app","http://localhost:5173"];
app.use(cors({ origin : allowedOrigins}));

// Body-Parser
app.use(express.json());
app.use(express.urlencoded({ extended : false }));

// Route
app.get('/',(req,res) => {
    res.send("Welcome To Todo-App");
});

app.get('/todo',async (req,res) => {
    const todo = await Todo.find();
    res.status(200).json(todo);
});

app.post('/add',async (req,res) => {
    const { task } = req.body;
    if(!task) return res.json({success : false,msg : 'Missing Details'});
    const todo = new Todo({ task });
    const todos = await todo.save()
    res.status(201).json(todos);
});

app.put('/edit/:id',async (req,res) => {
    const { id } = req.params;
    if(!id) return res.json({success : false,msg : 'Missing Params'});
    const todo = await Todo.findById(id);
    await Todo.findByIdAndUpdate({_id : id},{done : !todo.done});
    res.json(todo);
});

app.delete('/delete/:id',async (req,res) => {
     const { id } = req.params;
    if(!id) return res.json({success : false,msg : 'Missing Params'});
    await Todo.findByIdAndDelete(id);
    res.json({success : true,msg : 'Todo Deleted!'});
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  await Todo.findByIdAndUpdate(id, { task });
  res.json({ success: true, msg: "Task updated" });
});


app.listen(PORT,() => console.log(`Server is running on http://localhost:${PORT}`));