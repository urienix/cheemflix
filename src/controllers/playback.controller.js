import playbackHistory from "../models/playbackHistory";

export const savePlaybackHistory = async (profile, movie) => {
    let playbackHistoryDocument = new playbackHistory({
        profile,
        movie
    });
    await playbackHistoryDocument.save();
    return true;
}