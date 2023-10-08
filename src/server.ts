'use strict';
import  express  from 'express';

const app = express()

const port = 3333 //Trocar para o .env

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import client from './routes/client';
import collaborator from './routes/collaborator';
import os from './routes/os';
import scheduling from './routes/scheduling';
import services from './routes/services';
import vehicle from './routes/vehicle';

app.use(client);
app.use(os);
app.use(scheduling);
app.use(services);
app.use(vehicle);
app.use(collaborator);


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})