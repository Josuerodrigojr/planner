import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import {dayjs} from '../lib/dayjs'


export async function getActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/trips/:tripId/activies',
    {
      schema: {
        params:z.object({
            tripId: z.string().uuid(),
        })
      },
    },
    async (request) => {
    const {tripId} = request.params
 

    const trip = await prisma.trip.findUnique({
        where:
            {id: tripId},
            include: {activies: {
                orderBy:{
                    occurs_at: 'asc'
                }
            }}
        
    })

    const differenceDays = dayjs(trip?.ends_at).diff(trip?.starts_at, 'days')

    const activies = Array.from({length: differenceDays + 1}).map((_,index)=>
    {
const date = dayjs(trip?.starts_at).add(index, 'days')
return {
    date: date.toDate(),
    activies: trip?.activies.filter(activity=>{
        return dayjs(activity.occurs_at).isSame(date, 'days')
    })
}
    })

    console.log(activies)
    
    return {activies}
    }
    
  )
}