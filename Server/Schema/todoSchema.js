import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    task : {
        type : mongoose.Schema.Types.String,
        required : true
    },
    done : {
        type : mongoose.Schema.Types.Boolean,
        default : false
    }
});

const Todo = mongoose.model('todos',todoSchema);
export default Todo;