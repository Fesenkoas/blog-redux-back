import { Router } from "express";
import { checkAuth } from '../util/checkAuth.js';
import { createPost, getAll, getById, getMyPost, getPostComments, removePost, updatePost } from './../controllers/postsControl.js';

const router = new Router()

//Create Post
//http://localhost:3002/api/posts
router.post('/',checkAuth, createPost)

//Get All Post
//http://localhost:3002/api/posts
router.get('/',checkAuth, getAll)

//Get Post By Id
//http://localhost:3002/api/posts/:id
router.get('/:id',checkAuth, getById)

//Get My Post
//http://localhost:3002/api/posts/user/me
router.get('/user/me',checkAuth, getMyPost)

//Remove Post
//http://localhost:3002/api/posts/:id
router.delete('/:id',checkAuth, removePost)

//Update Post
//http://localhost:3002/api/posts/:id
router.put('/:id',checkAuth, updatePost)

//Get Post Comments
//http://localhost:3002/api/posts/comments/:id
router.get('/comments/:id', getPostComments)

export default router