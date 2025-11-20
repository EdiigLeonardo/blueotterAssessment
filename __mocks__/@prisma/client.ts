import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

export const mockedPrisma = mockDeep<PrismaClient>();

export default mockedPrisma;

beforeEach(() => {
  mockReset(mockedPrisma);
});