'use strict';
import  express  from 'express';
import cors from 'cors';

const app = express()

const port = 3333 //Trocar para o .env

var corsWhitelist = ['http://localhost:5173', '*']
var corsOptions = {
    origin: function (origin, callback) {
        if (corsWhitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Acesso não permitido'))
        }
    }
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import client from './routes/client';
import collaborator from './routes/collaborator';
import os from './routes/os';
import scheduling from './routes/scheduling';
import services from './routes/services';
import vehicle from './routes/vehicle';
import authenticate from './routes/auth';

app.use(client);
app.use(os);
app.use(scheduling);
app.use(services);
app.use(vehicle);
app.use(collaborator);
app.use(authenticate);


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})