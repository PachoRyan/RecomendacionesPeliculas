jest.mock('../services/tmdb');
jest.mock('../services/gemini');
jest.mock('axios');

const { search, details, videos, reviews } = require('./movies.controller');
const { searchMovies, getMovieDetails, getMovieVideos, getMovieReviews } = require('../services/tmdb');
const { summarizeReviews } = require('../services/gemini');
const axios = require('axios');

process.env.TMDB_TOKEN = 'test-tmdb-token';

const mockReq = (query = {}, params = {}) => ({ query, params });
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('search', () => {
    beforeEach(() => jest.clearAllMocks());

    it('retorna 400 si no se proporciona query', async () => {
        const req = mockReq({});
        const res = mockRes();
        await search(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Query is required' });
    });

    it('retorna lista de peliculas al buscar correctamente', async () => {
        const req = mockReq({ query: 'inception' });
        const res = mockRes();
        const movies = [{ id: 27205, title: 'Inception' }];
        searchMovies.mockResolvedValue(movies);

        await search(req, res);

        expect(searchMovies).toHaveBeenCalledWith('inception');
        expect(res.json).toHaveBeenCalledWith(movies);
    });

    it('retorna lista vacia si no hay resultados', async () => {
        const req = mockReq({ query: 'xyzabc123' });
        const res = mockRes();
        searchMovies.mockResolvedValue([]);

        await search(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });

    it('retorna 500 si el servicio TMDB falla', async () => {
        const req = mockReq({ query: 'inception' });
        const res = mockRes();
        searchMovies.mockRejectedValue(new Error('TMDB unavailable'));

        await search(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'TMDB unavailable' });
    });
});

describe('details', () => {
    beforeEach(() => jest.clearAllMocks());

    it('retorna detalles de la pelicula por ID', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        const movie = { id: 27205, title: 'Inception', overview: 'A thief who steals...' };
        getMovieDetails.mockResolvedValue(movie);

        await details(req, res);

        expect(getMovieDetails).toHaveBeenCalledWith('27205');
        expect(res.json).toHaveBeenCalledWith(movie);
    });

    it('retorna 500 si el servicio TMDB falla', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        getMovieDetails.mockRejectedValue(new Error('Movie not found'));

        await details(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Movie not found' });
    });
});

describe('videos', () => {
    beforeEach(() => jest.clearAllMocks());

    it('retorna el trailer de YouTube cuando existe', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        const trailer = { key: 'abc123', type: 'Trailer', site: 'YouTube' };
        const teaser = { key: 'xyz789', type: 'Teaser', site: 'YouTube' };
        getMovieVideos.mockResolvedValue([teaser, trailer]);

        await videos(req, res);

        expect(res.json).toHaveBeenCalledWith(trailer);
    });

    it('retorna cualquier video de YouTube si no hay Trailer', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        const clip = { key: 'clip1', type: 'Clip', site: 'YouTube' };
        getMovieVideos.mockResolvedValue([clip]);

        await videos(req, res);

        expect(res.json).toHaveBeenCalledWith(clip);
    });

    it('retorna null si no hay videos disponibles', async () => {
        const req = mockReq({}, { id: '99999' });
        const res = mockRes();
        getMovieVideos.mockResolvedValue([]);
        axios.get.mockResolvedValue({ data: { results: [] } });

        await videos(req, res);

        expect(res.json).toHaveBeenCalledWith(null);
    });

    it('retorna 500 si el servicio TMDB falla', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        getMovieVideos.mockRejectedValue(new Error('Service error'));

        await videos(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Service error' });
    });
});

describe('reviews', () => {
    beforeEach(() => jest.clearAllMocks());

    it('retorna resumen y total de reviews de la pelicula', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        getMovieDetails.mockResolvedValue({ id: 27205, title: 'Inception' });
        getMovieReviews.mockResolvedValue([
            { author: 'user1', content: 'Amazing movie!' },
            { author: 'user2', content: 'Mind-blowing.' },
        ]);
        summarizeReviews.mockResolvedValue('An excellent film about dreams within dreams.');

        await reviews(req, res);

        expect(summarizeReviews).toHaveBeenCalledWith('Inception', expect.any(Array));
        expect(res.json).toHaveBeenCalledWith({
            summary: 'An excellent film about dreams within dreams.',
            total: 2,
        });
    });

    it('retorna total 0 si no hay reviews', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        getMovieDetails.mockResolvedValue({ id: 27205, title: 'Inception' });
        getMovieReviews.mockResolvedValue([]);
        summarizeReviews.mockResolvedValue('No hay suficientes reseñas.');

        await reviews(req, res);

        expect(res.json).toHaveBeenCalledWith({
            summary: 'No hay suficientes reseñas.',
            total: 0,
        });
    });

    it('retorna 500 si getMovieDetails falla', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        getMovieDetails.mockRejectedValue(new Error('TMDB error'));

        await reviews(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'TMDB error' });
    });

    it('retorna 500 si summarizeReviews falla', async () => {
        const req = mockReq({}, { id: '27205' });
        const res = mockRes();
        getMovieDetails.mockResolvedValue({ title: 'Inception' });
        getMovieReviews.mockResolvedValue([{ content: 'Good' }]);
        summarizeReviews.mockRejectedValue(new Error('Gemini API error'));

        await reviews(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Gemini API error' });
    });
});
