import { faker } from '@faker-js/faker';

// Helper function to generate a random date within the last year
function generateRandomDate() {
  const currentDate = new Date();
  const lastYear = new Date(
    currentDate.getFullYear() - 1,
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  return new Date(
    lastYear.getTime() + Math.random() * (currentDate.getTime() - lastYear.getTime()),
  ).toISOString();
}

// Generate 10 instances for each type
export const rooms = Array.from({ length: 20 }, (_, index) => ({
  id: `server_${index + 1}`,
  name: `Server ${index + 1}`,
  type: index % 3 === 0 ? 'hidden' : index % 2 === 0 ? 'private' : 'public',
  imageUrl: faker.image.url(),
  inviteCode: faker.number.int(6),
  profileId: `profile_${index + 1}`,
  members: [],
  channels: [],
  createdAt: generateRandomDate(),
  updatedAt: generateRandomDate(),
}));

export const profiles = Array.from({ length: 10 }, (_, index) => ({
  id: `profile_${index + 1}`,
  email: faker.internet.email(),
  password: faker.internet.password(),
  ip: faker.internet.ip(),
  imageUrl: faker.image.avatar(),
  servers: [],
  members: [],
  channels: [],
  createdAt: generateRandomDate(),
  updatedAt: generateRandomDate(),
}));

export const members = Array.from({ length: 10 }, (_, index) => ({
  id: `member_${index + 1}`,
  role: index % 3 === 0 ? 'admin' : index % 2 === 0 ? 'moderator' : 'guest',
  profileId: `profile_${index + 1}`,
  serverId: `server_${index + 1}`,
  messages: [],
  directMessages: [],
  conversationsInitiated: [],
  conversationsReceived: [],
  createdAt: generateRandomDate(),
  updatedAt: generateRandomDate(),
}));

export const groups = Array.from({ length: 10 }, (_, index) => ({
  id: `channel_${index + 1}`,
  name: `Channel ${index + 1}`,
  type: index % 3 === 0 ? 'video' : index % 2 === 0 ? 'audio' : 'text',
  profileId: `profile_${index + 1}`,
  serverId: `server_${index + 1}`,
  messages: [],
  createdAt: generateRandomDate(),
  updatedAt: generateRandomDate(),
}));

export const messages = Array.from({ length: 10 }, (_, index) => ({
  id: `message_${index + 1}`,
  content: faker.lorem.sentence(),
  memberId: `member_${index + 1}`,
  channelId: `channel_${index + 1}`,
  deleted: false,
  createdAt: generateRandomDate(),
  updatedAt: generateRandomDate(),
}));

export const conversations = Array.from({ length: 10 }, (_, index) => ({
  id: `conversation_${index + 1}`,
  memberOneId: `member_${index + 1}`,
  memberTwoId: `member_${index + 2}`,
  directMessages: [],
}));

export const directMessages = Array.from({ length: 10 }, (_, index) => ({
  id: `direct_message_${index + 1}`,
  content: faker.lorem.sentence(),
  memberId: `member_${index + 1}`,
  conversationId: `conversation_${index + 1}`,
  deleted: false,
  createdAt: generateRandomDate(),
  updatedAt: generateRandomDate(),
}));
