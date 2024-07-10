import { ClientError } from './../errors/client-error';
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { getMailClient } from '../lib/mail'
import { dayjs } from '../lib/dayjs'
import { error } from 'console';

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/links',
    {
      schema: {
        params:z.object({
            tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
         
        }),
      },
    },
    async (request) => {
    const {tripId} = request.params
    const {title, url} = request.body

    const trip = await prisma.trip.findUnique({
        where:{
            id: tripId
        }
    })

    if (!trip){
        throw new Error ('A viagem não existe')
    }

   

    const link = await prisma.link.create({
        data:{
            title,
            url,
            trip_id: tripId
        }
    })
    return {linkId: link.id}
    }
    
  )
}