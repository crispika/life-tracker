import { PrismaClient } from '@prisma/client'
import { projectQueries } from './queries/project'

// declare global variable to support hot reload in development mode.
declare global {
  var prisma: undefined | PrismaClient
}

const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  })

// support hot reload in development mode. avoid creating multiple prisma instances.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

process.on('exit', () => {
  prisma.$disconnect()
})

process.on('SIGINT', () => {
  prisma.$disconnect().then(() => process.exit())
})

process.on('SIGTERM', () => {
  prisma.$disconnect().then(() => process.exit())
})

export { prisma, projectQueries }
