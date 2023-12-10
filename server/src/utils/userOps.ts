import { prisma } from '../prisma/db';
const sha1 = require('sha1');

const bufferData = (email: string, password: string): string => sha1(`${email}${password}`);

const registerUser = async (
  email: string,
  hashedPassword: string,
  ip: string | undefined,
): Promise<{ success: boolean; data?: 'username exist' }> => {
  const user = await prisma.profile.findUnique({
    where: { email: email },
  });

  if (!user) {
    const newUser = await prisma.profile.create({
      data: {
        email,
        password: hashedPassword,
        ip,
      },
    });

    return { success: true };
  } else {
    return { success: false, data: 'username exist' };
  }
};

const checkLogin = async (
  email: string,
  password: string,
): Promise<{ success: boolean; id?: string}> => {
  try {
    const user = await prisma.profile.findUnique({
      where: { email: email },
      select: { id: true, password: true },
    });

    if (!user) {
      return { success: false };
    } else {
      const storedPassword = String(user.password);

      if (password === storedPassword) {
        return {
          success: true,
          id: user.id,
        };
      } else {
        return { success: false };
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getUserData = async (id: string): Promise<{success: boolean, email?: string, ip?: string | null, imageUrl?: string | null, servers?: string[], members?: string[], channels?: string[]}> => {
    try {
      const user = await prisma.profile.findUnique({
        where: { id: id },
        select: { email: true, ip: true, imageUrl: true, servers: true, members: true, channels: true},
      });
  
      if (user) {
        return {
          success: true,
          email: user.email,
          ip: user.ip,
          imageUrl: user.imageUrl,   
        };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error(error);
      throw error;
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

export { registerUser, addIp, checkLogin, getUserData };
