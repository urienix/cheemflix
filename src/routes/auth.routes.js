import { Router } from 'express';

const router = Router();

router
    .get('/login', async (req, res) => {
        return res.render('auth/login');
    })

    .get('/register', async (req, res) => {
        return res.render('auth/register');
    })


export default router;