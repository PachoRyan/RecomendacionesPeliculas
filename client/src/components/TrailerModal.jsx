import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TrailerModal.module.css';

export default function TrailerModal({ videoKey, onClose }) {
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                className={styles.backdrop}
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.3 }}
                >
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                    <div className={styles.iframeWrapper}>
                        <iframe
                            src={'https://www.youtube.com/embed/' + videoKey + '?autoplay=1'}
                            title="Trailer"
                            frameBorder="0"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
