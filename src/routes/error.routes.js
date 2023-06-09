import { Router } from 'express';

const router = Router();

router

    .get('/404', async (req, res) => {
        return res.render('errors/404');
    })

    .get('/403', async (req, res) => {
        return res.render('errors/403');
    })

    .get('/500', async (req, res) => {
        return res.render('errors/500');
    })

export default router;