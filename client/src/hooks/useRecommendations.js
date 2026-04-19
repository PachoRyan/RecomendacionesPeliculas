import { useState } from 'react';
import { getRecommendations } from '../services/api';

export default function useRecommendations() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const load = async () => {
        if (loaded) return;
        setLoading(true);
        try {
            const { data } = await getRecommendations();
            setRecommendations(data);
            setLoaded(true);
        } catch {
            // no favorites yet
        } finally {
            setLoading(false);
        }
    };

    return { recommendations, loading, loaded, load };
}
