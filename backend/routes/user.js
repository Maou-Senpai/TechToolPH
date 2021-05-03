import express from 'express';
const router = express.Router();

//const user = require('../controllers/user.ctrl');

import user from '../controllers/user.controller.js';


/*router.get('/',(req,res)=>{
    res.send('tshi works@');
});*/

router.get('/',user.getUsers);
router.get('/:id',user.getUser);
router.get('/builds/:id',user.getUserBuilds);
router.delete('/delete/:id',user.deleteUser);
router.post('/signup',user.signup);

//module.exports = router;
export default router;