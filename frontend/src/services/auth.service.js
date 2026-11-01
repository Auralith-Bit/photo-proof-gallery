const delay = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

function nameFromEmail(email) {
  const local = (String(email).split("@")[0] || "").replace(/[._-]+/g, " ").trim();
  if (!local) return "Photographer";
  return local
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function makeUser(name, email) {
  const first = (name || "").split(" ")[0] || "Studio";
  return {
    id: `usr_${Math.random().toString(36).slice(2, 10)}`,
    name: name || nameFromEmail(email),
    email,
    studioName: `${first}'s Studio`,
    avatarUrl: null,
  };
}

export async function login({ email, password }) {
  await delay();
  if (email.toLowerCase() === "error@frameora.app" || password.length < 8) {
    throw new Error("Incorrect email or password. Please try again.");
  }
  const name =
    email.toLowerCase() === "studio@frameora.app" ? "Alex Morgan" : nameFromEmail(email);
  return { user: makeUser(name, email) };
}

export async function register({ name, email }) {
  await delay();
  if (email.toLowerCase() === "taken@frameora.app") {
    throw new Error("An account with this email already exists.");
  }
  return { user: makeUser(name, email) };
}

// Where you'd POST /api/auth/logout against the real backend.
export async function logout() {
  await delay(200);
  return { ok: true };
}

export async function requestPasswordReset(email) {
  await delay();
  return { ok: true, email };
}

export async function resetPassword({ token }) {
  await delay();
  if (!token || token === "expired") {
    throw new Error("This reset link is invalid or has expired.");
  }
  return { ok: true };
}