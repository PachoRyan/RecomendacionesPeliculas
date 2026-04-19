import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './RecommendationRow.module.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER = 'https://via.placeholder.com/500x750?text=Sin+imagen';

export default function RecommendationRow({ group, index }) {
    const navigate = useNavigate();

    return (
        <motion.div
            className={styles.group}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
        >
            <div className={styles.groupHeader}>
                <span className={styles.reason}>{group.reason}</span>
                <div className={styles.tags}>
                    {group.genres.map((g) => (
                        <span key={g} className={styles.tag}>
                            {g}
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.row}>
                {group.movies.map((movie) => (
                    <motion.div
                        key={movie.id}
                        className={styles.card}
                        onClick={() => navigate('/movie/' + movie.id)}
                        whileHover={{ y: -6, scale: 1.03 }}
                    >
                        <img
                            className={styles.poster}
                            src={movie.poster_path ? IMAGE_BASE + movie.poster_path : PLACEHOLDER}
                            alt={movie.title}
                        />
                        <div className={styles.cardInfo}>
                            <p className={styles.cardTitle}>{movie.title}</p>
                            <span className={styles.cardYear}>
                                {movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
