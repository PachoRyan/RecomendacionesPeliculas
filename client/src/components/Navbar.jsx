import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './Navbar.module.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <motion.nav
            className={styles.navbar}
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <Link to="/" className={styles.logo}>
                CINE<span>AI</span>
            </Link>
            <div className={styles.actions}>
                {user ? (
                    <>
                        <Link to="/profile" className={styles.username}>
                            ◈ {user.username}
                        </Link>
                        <motion.button
                            className={styles.logoutBtn}
                            onClick={handleLogout}
                            whileTap={{ scale: 0.95 }}
                        >
                            Salir
                        </motion.button>
                    </>
                ) : (
                    <motion.button
                        className={styles.loginBtn}
                        onClick={() => navigate('/auth')}
                        whileTap={{ scale: 0.95 }}
                    >
                        Iniciar sesión
                    </motion.button>
                )}
            </div>
        </motion.nav>
    );
}
