import type { FastifyInstance } from "fastify"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorMandler: FastifyErrorHandler = (error, request, reply) =>{

return reply.status(500).send({ message: 'Erro interno do servidor'})
}