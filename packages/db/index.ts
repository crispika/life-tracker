import { PrismaClient } from '@prisma/client';
import taskQueries from './prisma/queries/task';
import taskMutations from './prisma/mutations/task';
import { goalQueries } from './prisma/queries/goal';
import { goalMutations } from './prisma/mutations/goal';

//Prevent hot reloading from creating new instances of PrismaClient
//each instance of PrismaClient manages a connection pool, which means that a large number of clients can exhaust the database connection limit.
//https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const queries = {
  task: taskQueries,
  goal: goalQueries
};

const mutations = {
  task: taskMutations,
  goal: goalMutations
};

export { prisma, queries, mutations };
