import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import useSearch from '../hooks/useSearch';
import styles from './Home.module.css';

export default function Home() {
    const { movies, loading, error, parsedQuery, page, totalPages, search, goToPage } = useSearch();

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={styles.hero}>
                <motion.p
                    className={styles.eyebrow}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Powered by AI
                </motion.p>
                <motion.h1
                    className={styles.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    ENCUENTRA TU
                    <br />
                    <span className={styles.titleAccent}>próxima película</span>
                </motion.h1>
                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                >
                    Describe lo que quieres ver y la IA encontrará las mejores opciones para ti
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                    <SearchBar onSearch={search} loading={loading} />
                </motion.div>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        className={styles.error}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {error}
                    </motion.p>
                )}
                {loading && (
                    <motion.div
                        className={styles.loaderWrapper}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className={styles.loader} />
                        <p>Analizando búsqueda</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {!loading && movies.length > 0 && (
                <>
                    {parsedQuery && (
                        <motion.div
                            className={styles.resultsHeader}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className={styles.resultsLine} />
                            <p className={styles.parsedQuery}>
                                Resultados para: <span>{parsedQuery}</span>
                            </p>
                            <div className={styles.resultsLine} />
                        </motion.div>
                    )}
                    <motion.div
                        className={styles.grid}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {movies.map((movie, i) => (
                            <MovieCard key={movie.id} movie={movie} index={i} />
                        ))}
                    </motion.div>
                    <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
                </>
            )}
        </motion.div>
    );
}
