import { Router } from "express";
import { getMe, login, register } from './../controllers/auth.js';
import { checkAuth } from './../util/checkAuth.js';

const router = new Router()

//Reister
//http://localhost:3002/api/auth/register
router.post('/register', register)
//Login
//http://localhost:3002/api/auth/login
router.post('/login', login)
//Get Me
//http://localhost:3002/api/auth/me
router.get('/me',checkAuth, getMe)
export default router