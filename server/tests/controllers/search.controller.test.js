jest.mock('../../src/services/gemini');
jest.mock('../../src/services/tmdb');
jest.mock('../../src/models');

const { smartSearch } = require('../../src/controllers/search.controller');
const { parseSearchQuery } = require('../../src/services/gemini');
const { searchMovies, discoverMovies } = require('../../src/services/tmdb');
const { SearchHistory } = require('../../src/models');

const mockReq = (query = {}, user = null) => ({ query, user });
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('smartSearch', () => {
    beforeEach(() => jest.clearAllMocks());

    it('retorna 400 si no se proporciona query', async () => {
        const req = mockReq({});
        const res = mockRes();
        await smartSearch(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Query is required' });
    });

    it('busca peliculas usando generos parseados por Gemini sin token', async () => {
        const req = mockReq({ query: 'aventura espacial' });
        const res = mockRes();
        parseSearchQuery.mockResolvedValue({ genreIds: [878, 12], keywords: 'space adventure' });
        discoverMovies.mockResolvedValue({
            results: [{ id: 157336, title: 'Interstellar' }],
            totalPages: 5,
        });

        await smartSearch(req, res);

        expect(parseSearchQuery).toHaveBeenCalledWith('aventura espacial');
        expect(discoverMovies).toHaveBeenCalledWith([878, 12], 1);
        expect(res.json).toHaveBeenCalledWith({
            genreIds: [878, 12],
            keywords: 'space adventure',
            movies: [{ id: 157336, title: 'Interstellar' }],
            totalPages: 5,
            page: 1,
        });
    });

    it('usa genreIds provistos directamente sin llamar a Gemini', async () => {
        const req = mockReq({ query: 'accion', genreIds: '28,12' });
        const res = mockRes();
        discoverMovies.mockResolvedValue({
            results: [{ id: 1726, title: 'Iron Man' }],
            totalPages: 3,
        });

        await smartSearch(req, res);

        expect(parseSearchQuery).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({
            genreIds: [28, 12],
            keywords: 'accion',
            movies: [{ id: 1726, title: 'Iron Man' }],
            totalPages: 3,
            page: 1,
        });
    });

    it('usa busqueda por keyword como fallback si discover no retorna resultados', async () => {
        const req = mockReq({ query: 'pelicula rarísima' });
        const res = mockRes();
        parseSearchQuery.mockResolvedValue({ genreIds: [99], keywords: 'rare film' });
        discoverMovies.mockResolvedValue({ results: [], totalPages: 0 });
        searchMovies.mockResolvedValue({
            results: [{ id: 999, title: 'Rare Film' }],
            totalPages: 1,
        });

        await smartSearch(req, res);

        expect(searchMovies).toHaveBeenCalledWith('rare film', 1);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ movies: [{ id: 999, title: 'Rare Film' }] })
        );
    });

    it('no guarda historial si no hay usuario autenticado', async () => {
        const req = mockReq({ query: 'comedia' }, null);
        const res = mockRes();
        parseSearchQuery.mockResolvedValue({ genreIds: [35], keywords: 'comedy' });
        discoverMovies.mockResolvedValue({ results: [], totalPages: 0 });
        searchMovies.mockResolvedValue({ results: [], totalPages: 0 });

        await smartSearch(req, res);

        expect(SearchHistory.create).not.toHaveBeenCalled();
    });

    it('respeta la paginacion pasada en la query', async () => {
        const req = mockReq({ query: 'terror', page: '3' });
        const res = mockRes();
        parseSearchQuery.mockResolvedValue({ genreIds: [27], keywords: 'horror' });
        discoverMovies.mockResolvedValue({
            results: [{ id: 555, title: 'Horror Movie' }],
            totalPages: 10,
        });

        await smartSearch(req, res);

        expect(discoverMovies).toHaveBeenCalledWith([27], '3');
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ page: 3 })
        );
    });

    it('retorna 500 si parseSearchQuery falla', async () => {
        const req = mockReq({ query: 'cualquier cosa' });
        const res = mockRes();
        parseSearchQuery.mockRejectedValue(new Error('Gemini API unavailable'));

        await smartSearch(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Gemini API unavailable' });
    });

    it('retorna 500 si discoverMovies falla', async () => {
        const req = mockReq({ query: 'drama' });
        const res = mockRes();
        parseSearchQuery.mockResolvedValue({ genreIds: [18], keywords: 'drama' });
        discoverMovies.mockRejectedValue(new Error('TMDB service error'));

        await smartSearch(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'TMDB service error' });
    });
});
