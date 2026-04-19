import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import { getHistory, clearHistory } from '../services/api';

export default function useHistory() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!user) return;
        getHistory().then(({ data }) => setHistory(data));
    }, [user]);

    const clear = async () => {
        await clearHistory();
        setHistory([]);
    };

    return { history, clear };
}
