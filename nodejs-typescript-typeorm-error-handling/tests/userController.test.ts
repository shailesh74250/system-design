// tests/userController.test.ts
import { getUser } from '../src/controllers/userController';
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../src/entities/User';
import { NotFoundError } from '../src/errors/CustomError';

jest.mock('typeorm', () => ({
    getRepository: jest.fn(),
}));

describe('getUser', () => {
    it('should return user when found', async () => {
        const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
        (getRepository as jest.Mock).mockReturnValue({
            findOneOrFail: jest.fn().mockResolvedValue(mockUser),
        });

        const req = { params: { id: 1 } } as Request;
        const res = { json: jest.fn() } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await getUser(req, res, next);

        expect(res.json).toHaveBeenCalledWith(mockUser);
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next with NotFoundError when user not found', async () => {
        (getRepository as jest.Mock).mockReturnValue({
            findOneOrFail: jest.fn().mockRejectedValue({ name: 'EntityNotFound' }),
        });

        const req = { params: { id: 999 } } as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;

        await getUser(req, res, next);

        expect(next).toHaveBeenCalledWith(new NotFoundError('User not found'));
    });
});
