import { Router } from 'express';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed, checkIfUserHaveSelectedProfile } from "../middlewares/others";

import { getMoviesList, getMovieById } from "../controllers/movies.controller";

const router = Router();

router

    .get('/', checkSessionView, refreshAccessTokenView, checkIfUserHaveSelectedProfile, checkIfUserRolIsAllowed(['user']), async (req, res) => {
        const { user, profile } = req;
        let movies = await getMoviesList(profile.isKid);
        return res.render('client/movies', { user, profile, movies });
    })

    .get('/:movieId', checkSessionView, refreshAccessTokenView, checkIfUserHaveSelectedProfile, checkIfUserRolIsAllowed(['user']), async (req, res) => {
        const { user, profile } = req;
        let movie = await getMovieById(req.params.movieId);
        if (!movie.allowKids && profile.isKid) return res.status(403).redirect('/403');
        return res.render('client/watchMovie', { user, profile, movie });
    });

export default router;