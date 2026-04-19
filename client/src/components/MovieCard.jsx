import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useUserLists from '../hooks/useUserLists';
import styles from './MovieCard.module.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER = 'https://via.placeholder.com/500x750?text=Sin+imagen';

export default function MovieCard({ movie, index }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isFavorite, isInWatchlist, toggleFavorite, toggleWatchlist } = useUserLists();

    const handleFavorite = (e) => {
        e.stopPropagation();
        if (!user) return navigate('/auth');
        toggleFavorite(movie);
    };

    const handleWatchlist = (e) => {
        e.stopPropagation();
        if (!user) return navigate('/auth');
        toggleWatchlist(movie);
    };

    return (
        <motion.div
            className={styles.card}
            onClick={() => navigate('/movie/' + movie.id)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            <div className={styles.imageWrapper}>
                <img
                    className={styles.poster}
                    src={movie.poster_path ? IMAGE_BASE + movie.poster_path : PLACEHOLDER}
                    alt={movie.title}
                    loading="lazy"
                />
                <div className={styles.overlay}>
                    <span className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</span>
                </div>
                <div className={styles.actions}>
                    <motion.button
                        className={
                            styles.actionBtn + (isFavorite(movie.id) ? ' ' + styles.active : '')
                        }
                        onClick={handleFavorite}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        title="Favorito"
                    >
                        {isFavorite(movie.id) ? '❤️' : '🤍'}
                    </motion.button>
                    <motion.button
                        className={
                            styles.actionBtn + (isInWatchlist(movie.id) ? ' ' + styles.active : '')
                        }
                        onClick={handleWatchlist}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        title="Quiero ver"
                    >
                        {isInWatchlist(movie.id) ? '🔖' : '➕'}
                    </motion.button>
                </div>
            </div>
            <div className={styles.info}>
                <h3 className={styles.title}>{movie.title}</h3>
                <span className={styles.year}>
                    {movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}
                </span>
            </div>
        </motion.div>
    );
}
