import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const smartSearch = (query, page = 1, genreIds = null) => {
    let url = '/search?query=' + query + '&page=' + page;
    if (genreIds) url += '&genreIds=' + genreIds.join(',');
    return api.get(url);
};
export const getMovieDetails = (id) => api.get('/movies/' + id);
export const getMovieVideos = (id) => api.get('/movies/' + id + '/videos');
export const getHistory = () => api.get('/history');
export const clearHistory = () => api.delete('/history');
export const getRecommendations = () => api.get('/recommendations');
export const getMovieReviews = (id) => api.get('/movies/' + id + '/reviews');

export default api;
