import { prisma } from '../prisma/db';
const sha1 = require('sha1');

const bufferData = (email: string, password: string): string => sha1(`${email}${password}`);

const registerUser = async (
  email: string,
  hashedPassword: string,
  ip: string | undefined,
): Promise<{ success: boolean; data?: 'username exist' }> => {
  const user = await prisma.profile.findUnique({
    where: { email },
  });

  if (!user) {
    const newUser = await prisma.profile.create({
      data: {
        email,
        password: hashedPassword,
        hashId: bufferData(email, hashedPassword),
        ip,
      },
    });

    return { success: true };
  } else {
    return { success: false, data: 'username exist' };
  }
};

const addIp = async (email: string, ip: string | undefined): Promise<void> => {
  try {
    const updatedProfile = await prisma.profile.update({
      where: { email },
      data: { ip },
    });

    console.log(`ip ${ip} added...`);
  } catch (err) {
    console.error(err);
  }
};

export { registerUser, addIp };
