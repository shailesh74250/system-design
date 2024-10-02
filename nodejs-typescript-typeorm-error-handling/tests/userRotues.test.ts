// tests/userRoutes.test.ts
import request from 'supertest';
import app from '../src/index'; // Assuming your Express app is exported from index.ts
import { getRepository } from 'typeorm';
import { User } from '../src/entities/User';

jest.mock('typeorm', () => ({
    getRepository: jest.fn(),
}));

describe('User Routes', () => {
    describe('GET /users/:id', () => {
        it('should return 200 and user data when found', async () => {
            const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
            (getRepository as jest.Mock).mockReturnValue({
                findOneOrFail: jest.fn().mockResolvedValue(mockUser),
            });

            const response = await request(app).get('/users/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });

        it('should return 404 when user not found', async () => {
            (getRepository as jest.Mock).mockReturnValue({
                findOneOrFail: jest.fn().mockRejectedValue({ name: 'EntityNotFound' }),
            });

            const response = await request(app).get('/users/999');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'User not found' });
        });
    });
});
