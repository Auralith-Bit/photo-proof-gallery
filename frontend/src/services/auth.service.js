const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login({ email, password }) {
  await delay();
  if (email.toLowerCase() === "error@frameora.app" || password.length < 8) {
    throw new Error("Incorrect email or password. Please try again.");
  }
  return { user: { name: "Alex Morgan", email } };
}

export async function register({ name, email }) {
  await delay();
  if (email.toLowerCase() === "taken@frameora.app") {
    throw new Error("An account with this email already exists.");
  }
  return { user: { name, email } };
}

export async function requestPasswordReset(email) {
  await delay();
  return { ok: true, email };
}

export async function resetPassword({ token, password }) {
  await delay();
  if (!token || token === "expired") {
    throw new Error("This reset link is invalid or has expired.");
  }
  return { ok: true };
}