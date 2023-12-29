import { Request } from 'express';
import { Profile } from '@prisma/client';
import { db } from '@/prisma/db';
import { UUID, randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';

export const getIp = (req: Request) =>
  (req.headers['x-forwarded-for'] || req.socket.remoteAddress)?.toString();

export const addIp = async (email: string, ip: string | undefined): Promise<Profile | null> => {
  try {
    const updatedProfile = await db.profile.update({
      where: { email },
      data: { ip },
    });
    return updatedProfile;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const uuid: () => string | UUID = randomUUID;

const TRUTHY = [1, true, '1', 'true'];
export const isTruthy = (value: any) => TRUTHY.includes(value);

export const convertMbToBytes = (mb: number) => mb * Math.pow(1024, 2);

export const getFormatedDate = () => {
  const now = new Date();
  return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
};

export const sendPasswordResetEmail = (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    // Your email configuration goes here
  });

  const resetLink = `http://localhost:8000/api/auth/reset?token=${token}`;

  const mailOptions = {
    from: 'your-email@example.com',
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};


