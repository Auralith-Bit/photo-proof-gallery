import { mockActivity } from "../mocks/activity.mock";
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function getRecentActivity() {
  await delay();
  return mockActivity;
}