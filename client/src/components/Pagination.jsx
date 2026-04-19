import { motion } from 'framer-motion';
import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const delta = 2;
    const left = Math.max(1, page - delta);
    const right = Math.min(totalPages, page + delta);

    for (let i = left; i <= right; i++) pages.push(i);

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
        >
            <motion.button
                className={styles.btn}
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                ←
            </motion.button>

            {left > 1 && (
                <>
                    <motion.button
                        className={styles.btn}
                        onClick={() => onPageChange(1)}
                        whileHover={{ scale: 1.1 }}
                    >
                        1
                    </motion.button>
                    {left > 2 && <span className={styles.dots}>…</span>}
                </>
            )}

            {pages.map((p) => (
                <motion.button
                    key={p}
                    className={styles.btn + (p === page ? ' ' + styles.active : '')}
                    onClick={() => onPageChange(p)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {p}
                </motion.button>
            ))}

            {right < totalPages && (
                <>
                    {right < totalPages - 1 && <span className={styles.dots}>…</span>}
                    <motion.button
                        className={styles.btn}
                        onClick={() => onPageChange(totalPages)}
                        whileHover={{ scale: 1.1 }}
                    >
                        {totalPages}
                    </motion.button>
                </>
            )}

            <motion.button
                className={styles.btn}
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                →
            </motion.button>
        </motion.div>
    );
}
