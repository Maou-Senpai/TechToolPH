import express from 'express';
const router = express.Router();
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import User from '../models/user.model.js';


import user from '../controllers/user.controller.js';

//auth
router.post('/signup',user.signup);
router.post('/login',user.login);
router.post('/tokenIsValid',user.tokenIsValid);

//get user with token
router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
    });
});

router.get('/users', user.getUsers);
router.get('/:id',user.getUser);
router.get('/builds/:id',user.getUserBuilds);
router.delete('/delete/:id',user.deleteUser);

//module.exports = router;
export default router;