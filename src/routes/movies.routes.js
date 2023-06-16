import { Router } from 'express';

import { checkSessionView, refreshAccessTokenView } from "../middlewares/jwtoken";
import { checkIfUserRolIsAllowed, checkIfUserHaveSelectedProfile } from "../middlewares/others";

import { getMoviesList, getMovieById } from "../controllers/movies.controller";

import { savePlaybackHistory } from "../controllers/playback.controller";

const router = Router();

router

    .get('/', checkSessionView, refreshAccessTokenView, checkIfUserHaveSelectedProfile, checkIfUserRolIsAllowed(['user']), async (req, res) => {
        const { user, profile } = req;
        let movies = await getMoviesList(profile.isKid);
        return res.render('client/movies', { user, profile, movies });
    })

    .get('/:movieId', checkSessionView, refreshAccessTokenView, checkIfUserHaveSelectedProfile, checkIfUserRolIsAllowed(['user']), async (req, res) => {
        const { user, profile } = req;
        const { movieId } = req.params;
        let movie = await getMovieById(movieId);
        if (!movie.allowKids && profile.isKid) return res.status(403).redirect('/403');
        await savePlaybackHistory(profile.profileId, movie._id.toString()); // Save playback history
        return res.render('client/watchMovie', { user, profile, movie });
    });

export default router;