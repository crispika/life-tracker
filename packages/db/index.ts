import { PrismaClient } from '@prisma/client'
import projectQueries from './prisma/queries/project'
import projectMutations from './prisma/mutations/project'

//Prevent hot reloading from creating new instances of PrismaClient
//each instance of PrismaClient manages a connection pool, which means that a large number of clients can exhaust the database connection limit.
//https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections#prevent-hot-reloading-from-creating-new-instances-of-prismaclient
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const queries = {
  project: projectQueries
}

const mutations = {
  project: projectMutations
}

export { prisma, queries, mutations }
