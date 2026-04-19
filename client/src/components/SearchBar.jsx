import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, loading }) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(value);
    };

    return (
        <motion.form
            className={styles.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className={styles.inputWrapper}>
                <span className={styles.icon}>🔍</span>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Describe la película que buscas..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={loading}
                />
                <motion.button
                    className={styles.button}
                    type="submit"
                    disabled={loading || !value.trim()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </motion.button>
            </div>
        </motion.form>
    );
}
