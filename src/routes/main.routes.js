import { Router } from 'express';

const router = Router();

router
    .get('/', async (req, res) => {
        return res.render('template');
    })

    .get('/login', async (req, res) => {
        return res.render('auth/login');
    })

    .get('/register', async (req, res) => {
        return res.render('auth/register');
    })

    .get('/error', async (req, res) => {
        return res.render('errors/error');
    })

export default router;