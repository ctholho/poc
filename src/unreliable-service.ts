import 'dotenv/config'
import express from 'express';
import http from 'http';
import { fuckItUp, prepEmail } from './helpers'
import type { Request, Response } from 'express'

// 🏁 SETUP Server
const app = express();
app.use(express.json());

const httpServer = http.createServer(app);
httpServer.listen(3001, () => {
  console.log(`External sideeffects Server is running on http://localhost:3001`);
});

// 🚦 Routes
app.post('/urlaub-melden', async (req: Request, res: Response) => {
  // FIXME:
  // if (req.body.mitarbeiter === 'haha@lol.aaa') {
  //   return res.status(400).send('Error: too much');
  // }
  res.status(200).send('Urlaub im Mitarbeiterportal gemeldet.')
})

app.post('/urlaub-bestaetigen', async (_: Request, res: Response) => {
  res.status(200).send('Urlaub im Mitarbeiterportal bestätigt.')
})

app.post('/urlaub-absagen', async (_: Request, res: Response) => {
  res.status(200).send('Urlaub im Mitarbeiterportal wieder abgesagt.')
})

/** Send mail */
app.post('/email', async (req: Request, res: Response) => {
  try {
    const { mailTransporter, to, text } = prepEmail(req);
    mailTransporter.sendMail({ to, text, subject: 'Dein Urlaub ...', from: process.env.EMAIL_USER })
    return res.status(200).send('email send')
  }
  catch (err) {
    return res.status(500).send('error while sending email');
  }

})

