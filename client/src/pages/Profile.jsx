import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useRecommendations from '../hooks/useRecommendations';
import RecommendationRow from '../components/RecommendationRow';
import useUserLists from '../hooks/useUserLists';
import useHistory from '../hooks/useHistory';
import styles from './Profile.module.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const PLACEHOLDER = 'https://via.placeholder.com/500x750?text=Sin+imagen';

const MovieMiniCard = ({ item, onRemove, onNavigate }) => (
    <motion.div
        className={styles.miniCard}
        onClick={() => onNavigate('/movie/' + item.movieId)}
        whileHover={{ y: -4 }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
    >
        <img
            src={item.posterPath ? IMAGE_BASE + item.posterPath : PLACEHOLDER}
            alt={item.title}
            className={styles.miniPoster}
        />
        <button
            className={styles.removeBtn}
            onClick={(e) => {
                e.stopPropagation();
                onRemove(item);
            }}
        >
            ✕
        </button>
        <div className={styles.miniInfo}>
            <p className={styles.miniTitle}>{item.title}</p>
            <span className={styles.miniYear}>
                {item.releaseDate ? item.releaseDate.slice(0, 4) : 'N/A'}
            </span>
        </div>
    </motion.div>
);

export default function Profile() {
    const { user } = useAuth();
    const { favorites, watchlist, toggleFavorite, toggleWatchlist } = useUserLists();
    const { recommendations, loading: recLoading, loaded, load } = useRecommendations();
    const { history, clear } = useHistory();
    const navigate = useNavigate();

    if (!user) {
        navigate('/auth');
        return null;
    }

    const toMovie = (item) => ({
        id: item.movieId,
        title: item.title,
        poster_path: item.posterPath,
        vote_average: item.voteAverage,
        release_date: item.releaseDate,
    });

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.header}>
                <div className={styles.avatar}>{user.username[0].toUpperCase()}</div>
                <div className={styles.userInfo}>
                    <h1 className={styles.username}>{user.username.toUpperCase()}</h1>
                    <p className={styles.email}>{user.email}</p>
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statNum}>{favorites.length}</span>
                        <span className={styles.statLabel}>Favoritos</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNum}>{watchlist.length}</span>
                        <span className={styles.statLabel}>Por ver</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNum}>{history.length}</span>
                        <span className={styles.statLabel}>Búsquedas</span>
                    </div>
                </div>
            </div>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        ❤ Favoritos <span className={styles.sectionCount}>{favorites.length}</span>
                    </h2>
                </div>
                {favorites.length === 0 ? (
                    <p className={styles.empty}>No tienes favoritos aún</p>
                ) : (
                    <div className={styles.grid}>
                        {favorites.map((item) => (
                            <MovieMiniCard
                                key={item.id}
                                item={item}
                                onRemove={() => toggleFavorite(toMovie(item))}
                                onNavigate={navigate}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        ◈ Quiero ver <span className={styles.sectionCount}>{watchlist.length}</span>
                    </h2>
                </div>
                {watchlist.length === 0 ? (
                    <p className={styles.empty}>Tu lista está vacía</p>
                ) : (
                    <div className={styles.grid}>
                        {watchlist.map((item) => (
                            <MovieMiniCard
                                key={item.id}
                                item={item}
                                onRemove={() => toggleWatchlist(toMovie(item))}
                                onNavigate={navigate}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        ◷ Historial <span className={styles.sectionCount}>{history.length}</span>
                    </h2>
                    {history.length > 0 && (
                        <motion.button
                            className={styles.clearBtn}
                            onClick={clear}
                            whileTap={{ scale: 0.95 }}
                        >
                            Limpiar
                        </motion.button>
                    )}
                </div>
                {history.length === 0 ? (
                    <p className={styles.empty}>No hay búsquedas recientes</p>
                ) : (
                    <div className={styles.historyList}>
                        {history.map((item, i) => (
                            <motion.div
                                key={item.id}
                                className={styles.historyItem}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                onClick={() => navigate('/?q=' + item.query)}
                            >
                                <span className={styles.historyIcon}>⌕</span>
                                <div>
                                    <p className={styles.historyQuery}>{item.query}</p>
                                    <p className={styles.historyParsed}>{item.parsedQuery}</p>
                                </div>
                                <span className={styles.historyDate}>
                                    {new Date(item.createdAt).toLocaleDateString('es-PE')}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        ✦ Para ti <span className={styles.sectionCount}>IA</span>
                    </h2>
                    {!loaded && (
                        <motion.button
                            className={styles.clearBtn}
                            onClick={load}
                            disabled={recLoading}
                            whileTap={{ scale: 0.95 }}
                        >
                            {recLoading ? 'Analizando...' : 'Generar'}
                        </motion.button>
                    )}
                </div>
                {!loaded && !recLoading && (
                    <p className={styles.empty}>Genera recomendaciones basadas en tus favoritos</p>
                )}
                {recLoading && (
                    <div className={styles.recLoader}>
                        <div className={styles.loader} />
                        <p>Analizando tus gustos...</p>
                    </div>
                )}
                {recommendations.map((group, i) => (
                    <RecommendationRow key={i} group={group} index={i} />
                ))}
            </section>
        </motion.div>
    );
}
