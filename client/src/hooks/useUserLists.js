import { useState, useEffect } from 'react';
import api from '../services/api';
import useAuth from './useAuth';

export default function useUserLists() {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        if (!user) return;
        api.get('/favorites').then(({ data }) => setFavorites(data));
        api.get('/watchlist').then(({ data }) => setWatchlist(data));
    }, [user]);

    const isFavorite = (movieId) => favorites.some((f) => f.movieId === movieId);
    const isInWatchlist = (movieId) => watchlist.some((w) => w.movieId === movieId);

    const toggleFavorite = async (movie) => {
        if (isFavorite(movie.id)) {
            await api.delete('/favorites/' + movie.id);
            setFavorites(favorites.filter((f) => f.movieId !== movie.id));
        } else {
            const { data } = await api.post('/favorites', {
                movieId: movie.id,
                title: movie.title,
                posterPath: movie.poster_path,
                voteAverage: movie.vote_average,
                releaseDate: movie.release_date,
            });
            setFavorites([...favorites, data]);
        }
    };

    const toggleWatchlist = async (movie) => {
        if (isInWatchlist(movie.id)) {
            await api.delete('/watchlist/' + movie.id);
            setWatchlist(watchlist.filter((w) => w.movieId !== movie.id));
        } else {
            const { data } = await api.post('/watchlist', {
                movieId: movie.id,
                title: movie.title,
                posterPath: movie.poster_path,
                voteAverage: movie.vote_average,
                releaseDate: movie.release_date,
            });
            setWatchlist([...watchlist, data]);
        }
    };

    return { favorites, watchlist, isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist };
}
