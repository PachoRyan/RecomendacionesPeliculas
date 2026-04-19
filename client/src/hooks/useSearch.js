import { useState } from 'react';
import { smartSearch } from '../services/api';

export default function useSearch() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [parsedQuery, setParsedQuery] = useState('');
    const [currentQuery, setCurrentQuery] = useState('');
    const [currentGenreIds, setCurrentGenreIds] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const search = async (query, pageNumber = 1, genreIds = null) => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await smartSearch(query, pageNumber, genreIds);
            setMovies(data.movies);
            setParsedQuery(data.keywords);
            setCurrentQuery(query);
            setCurrentGenreIds(data.genreIds);
            setPage(data.page);
            setTotalPages(Math.min(data.totalPages, 10));
        } catch {
            setError('Error al buscar películas');
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (pageNumber) => search(currentQuery, pageNumber, currentGenreIds);

    return { movies, loading, error, parsedQuery, page, totalPages, search, goToPage };
}
