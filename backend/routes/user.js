import express from 'express';
const router = express.Router();
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

//const user = require('../controllers/user.ctrl');

import user from '../controllers/user.controller.js';

/*router.get('/',(req,res)=>{
    res.send('tshi works@');
});*/

router.get('/', user.getUsers);
router.get('/:id',user.getUser);
router.get('/builds/:id',user.getUserBuilds);
router.delete('/delete/:id',user.deleteUser);
router.post('/signup',user.signup);
router.post('/login',user.login);
router.post('/tokenIsValid',user.tokenIsValid);

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        usernmae: user.username,
        id: user._id,
    });
});

//module.exports = router;
export default router;