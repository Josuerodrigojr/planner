import { ClientError } from './../errors/client-error';
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { getMailClient } from '../lib/mail'
import { dayjs } from '../lib/dayjs'
import { error } from 'console';

export async function createActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/activies',
    {
      schema: {
        params:z.object({
            tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date(),
         
        }),
      },
    },
    async (request) => {
    const {tripId} = request.params
    const {title, occurs_at} = request.body

    const trip = await prisma.trip.findUnique({
        where:{
            id: tripId
        }
    })

    if (!trip){
        throw new Error ('A viagem não existe')
    }

    if(dayjs(occurs_at).isBefore(trip.starts_at)){
        throw new Error ('A data está invalida')
    }

    if(dayjs(occurs_at).isAfter(trip.ends_at)){
        throw new Error ('A data está invalida')
    }

    const activity = await prisma.activity.create({
        data:{
            title,
            occurs_at,
            trip_id: tripId
        }
    })
    return {activityId: activity.id}
    }
    
  )
}