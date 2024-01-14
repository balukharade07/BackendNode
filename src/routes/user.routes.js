import { Router } from 'express';
import { registreUser } from '../controllers/user.controllers.js';
import { upload } from '../middlewares/multer.middlewares.js'

const router = Router();

router.route('/register').post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]) , registreUser);


export default router;