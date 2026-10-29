import { mockUser } from "../mocks/user.mock";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getUser() {
  await delay();
  return mockUser;
}