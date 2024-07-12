import { ClientError } from './../errors/client-error';
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { getMailClient } from '../lib/mail'
import { dayjs } from '../lib/dayjs'

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/trips/:tripsId',
    {
      schema: {
        params: z.object({
            tripId : z.string().uuid()
        }),
        body: z.object({
          destination: z.string().min(4),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          
        }),
      },
    },
    async (request) => {
        const {tripId} = request.params
      const {
        destination,
        starts_at,
        ends_at
      } = request.body

      const trip = await prisma.trip.findUnique({
        where:{id: tripId}
      })

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new ClientError('Invalid trip start date.')
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new ClientError('Invalid trip end date.')
      }

     await prisma.trip.update({
        where: { id: tripId},
        data: {
            destination,
            starts_at,
            ends_at
        }
     })

      return { tripId: trip?.id }
    },
  )
}