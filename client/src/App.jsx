import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthProvider from './context/AuthProvider';
import Navbar from './components/Navbar';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

export default function App() {
    const location = useLocation();

    return (
        <AuthProvider>
            <Navbar />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route
                        path="/"
                        element={
                            <PageTransition>
                                <Home />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="/movie/:id"
                        element={
                            <PageTransition>
                                <MovieDetail />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="/auth"
                        element={
                            <PageTransition>
                                <Auth />
                            </PageTransition>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PageTransition>
                                <Profile />
                            </PageTransition>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </AuthProvider>
    );
}
