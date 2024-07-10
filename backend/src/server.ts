import fastify from "fastify";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import cors from '@fastify/cors'
import { confirmParticipan } from "./routes/confirm-partcipant";
import { createActivity } from "./routes/create-activity";
import { getActivity } from "./routes/get-activity";
import { createLink } from "./routes/create-link";
import { getLink } from "./routes/get-link";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
    origin: '*'
})

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipan)
app.register(createActivity)
app.register(getActivity)
app.register(createLink)
app.register(getLink)



app.listen({port: 3000}).then(()=>{console.log('Conectou')})