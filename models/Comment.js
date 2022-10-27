import mongoose from "mongoose";

const CommentShema = new mongoose.Schema({
    comment:{type: String, required:true},
    autor:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
},
{timestamps:true}
)

export default mongoose.model('Comment', CommentShema)