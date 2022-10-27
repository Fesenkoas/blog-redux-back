import { Router } from "express";
import { checkAuth } from '../util/checkAuth.js';
import { createComment } from './../controllers/commentControl.js';
const router = new Router()

//Create Comment
//http://localhost:3002/api/comment/:id
router.post('/:id',checkAuth, createComment)


export default router