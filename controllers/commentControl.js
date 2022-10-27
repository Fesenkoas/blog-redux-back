import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    if (!comment) return res.json({ message: "Plase read comments" });

    const newComents = new Comment({ comment });
    await newComents.save();
    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComents._id },
      });
    } catch (error) {
      res.json({ message: error.message });
    }
    res.json(newComents);
  } catch (error) {
    res.json({ message: error.message });
  }
};
