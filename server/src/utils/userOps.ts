import { prisma } from '../prisma/db';

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

export {addIp};
