jest.mock('../../src/models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const { register, login } = require('../../src/controllers/auth.controller');
const { User } = require('../../src/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';

const mockReq = (body = {}) => ({ body });
const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('register', () => {
    beforeEach(() => jest.clearAllMocks());

    it('retorna 400 si faltan campos requeridos', async () => {
        const req = mockReq({ username: 'user', email: 'u@test.com' }); // falta password
        const res = mockRes();
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
    });

    it('retorna 400 si todos los campos estan vacios', async () => {
        const req = mockReq({});
        const res = mockRes();
        await register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retorna 201 con token y usuario al registrarse exitosamente', async () => {
        const req = mockReq({ username: 'user', email: 'user@test.com', password: 'pass123' });
        const res = mockRes();
        bcrypt.hash.mockResolvedValue('hashedpass');
        User.create.mockResolvedValue({ id: 1, username: 'user', email: 'user@test.com' });
        jwt.sign.mockReturnValue('mocked-token');

        await register(req, res);

        expect(bcrypt.hash).toHaveBeenCalledWith('pass123', 10);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            token: 'mocked-token',
            user: { id: 1, username: 'user', email: 'user@test.com' },
        });
    });

    it('retorna 409 si el username o email ya existe', async () => {
        const req = mockReq({ username: 'user', email: 'user@test.com', password: 'pass123' });
        const res = mockRes();
        bcrypt.hash.mockResolvedValue('hashedpass');
        User.create.mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: 'Username or email already exists' });
    });

    it('retorna 500 en error inesperado', async () => {
        const req = mockReq({ username: 'user', email: 'user@test.com', password: 'pass123' });
        const res = mockRes();
        bcrypt.hash.mockResolvedValue('hashedpass');
        User.create.mockRejectedValue(new Error('DB connection failed'));

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB connection failed' });
    });
});

describe('login', () => {
    beforeEach(() => jest.clearAllMocks());

    it('retorna 400 si faltan campos requeridos', async () => {
        const req = mockReq({ email: 'user@test.com' }); // falta password
        const res = mockRes();
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
    });

    it('retorna 404 si el usuario no existe', async () => {
        const req = mockReq({ email: 'noexiste@test.com', password: 'pass123' });
        const res = mockRes();
        User.findOne.mockResolvedValue(null);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('retorna 401 si la contrasena es incorrecta', async () => {
        const req = mockReq({ email: 'user@test.com', password: 'wrongpass' });
        const res = mockRes();
        User.findOne.mockResolvedValue({
            id: 1,
            username: 'user',
            email: 'user@test.com',
            password: 'hashedpass',
        });
        bcrypt.compare.mockResolvedValue(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('retorna token y datos del usuario al autenticarse correctamente', async () => {
        const req = mockReq({ email: 'user@test.com', password: 'pass123' });
        const res = mockRes();
        User.findOne.mockResolvedValue({
            id: 1,
            username: 'user',
            email: 'user@test.com',
            password: 'hashedpass',
        });
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mocked-token');

        await login(req, res);

        expect(res.json).toHaveBeenCalledWith({
            token: 'mocked-token',
            user: { id: 1, username: 'user', email: 'user@test.com' },
        });
    });

    it('retorna 500 en error inesperado', async () => {
        const req = mockReq({ email: 'user@test.com', password: 'pass123' });
        const res = mockRes();
        User.findOne.mockRejectedValue(new Error('DB timeout'));

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB timeout' });
    });
});
