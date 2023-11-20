import nodemailer from 'nodemailer';
import type { Request, Response, NextFunction } from 'express';
import type { Transporter } from 'nodemailer'

export interface IPrepEmail {
  to: string;
  text: string;
  mailTransporter: Transporter
}

export function prepEmail(req: Request): IPrepEmail {
  const { to, text } = req.body

  if (!to || !text) {
    throw new Error('Error while sending Email. You must provide TO, FROM and TEXT')
  }

  const mailTransporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  return { mailTransporter, to, text }
}

export function fuckItUpMiddleware(req: Request, res: Response, next: NextFunction, failFactor: number) {
  res.status(500).send('Error: Sucks to be you. Lol!')
}

