import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);
    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "upload", fileName));

      const newPostWithImage = new Post({
        username: user.username,
        title,
        text,
        imgUrl: fileName,
        autor: req.userId,
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { post: newPostWithImage },
      });
      return res.json(newPostWithImage);
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      text,
      imageUrl: "",
      autor: req.userId,
    });

    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { post: newPostWithoutImage },
    });
    return res.json(newPostWithoutImage);
  } catch (e) {
    res.json({ message: "So some wrong" });
  }
};

//Get All Posts

export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt");
    const popularPosts = await Post.find().limit(5).sort("-views");
    if (!posts) {
      return res.json({ message: "Not Post" });
    }
    res.json({ posts, popularPosts });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Get Post By Id

export const getById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.json(post);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Get My Post

export const getMyPost = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const list = await Promise.all(
      user.post.map((p) => {
        return Post.findById(p._id);
      })
    );
    res.json(list);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Remove Post

export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.json({ message: "Post not find" });
    await User.findByIdAndUpdate(req.userId, {
      $pull: { post: req.params.id },
    });
    res.json({ message: "Post delete done!" });
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Update Post

export const updatePost = async (req, res) => {
  try {
    const { title, text, id } = req.body;
    const post = await Post.findById(id);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(path.join(__dirname, "..", "upload", fileName));
      post.imgUrl = fileName || "";
    }
    post.title = title;
    post.text = text;

    await post.save()
    res.json(post);
  } catch (error) {
    res.json({ message: error.message });
  }
};

//Get Post Comments

export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const list = await Promise.all(
      post.comments.map((p) => {
        return Comment.findById(p);
      })
    );
    res.json(list);
  } catch (error) {
    res.json({ message: error.message });
  }
};
