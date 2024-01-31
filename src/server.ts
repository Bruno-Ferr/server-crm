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

//app.use(cors(corsOptions));
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


import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51OekrXEswmyy7wKN20ZJH014NK7T2BBBq6XkzzlxLaLP9O4qFSZAnkL7oUnU2EqDwYp0vTI5lxT3SDVnhzIKZptt00qFjhhDvp')


const params = {
            
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    line_items: [
        {price: 'prod_PTiQ9eYpxuY0eW', quantity: 1},
    ],
    subscriptionData: {
        trial_period_days: 7
    },
    mode: 'subscription',
}

app.get("/create-test-payment", async (req, res) => {
    try {
        const session = await stripe.paymentLinks.create({
            after_completion: {
                type: 'redirect',
                redirect: {
                    url: 'http://localhost:3000/'
                }
            },
            line_items: [
                {price: 'price_1OekzWEswmyy7wKNgkbEnVGi', quantity: 1},
            ], 
            subscription_data: {
                trial_period_days: 7
            }
        })
        return res.json({url: session.url})
    } catch (err) {

    }
})




app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})