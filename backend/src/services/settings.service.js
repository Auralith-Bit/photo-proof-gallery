import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Album from "../models/Album.js";
import Photo from "../models/Photo.js";

function ensureSettings(user) {
  const current = user.settings || {};
  const currentYear = new Date().getFullYear();

  const profile = {
    displayName: current.profile?.displayName || user.name || "Photographer",
    email: current.profile?.email || user.email || "",
    emailVerified: current.profile?.emailVerified !== false,
    imageUrl: current.profile?.imageUrl || null,
    imageName: current.profile?.imageName || "",
  };

  const studioDefault = user.name ? `${user.name} Studio` : "Frameora Studio";
  const branding = {
    studioName: current.branding?.studioName || studioDefault,
    logoUrl: current.branding?.logoUrl || null,
    logoName: current.branding?.logoName || "",
    logoStyle: current.branding?.logoStyle || "both",
    showFooter: current.branding?.showFooter !== false,
    footerText:
      current.branding?.footerText ||
      `© ${currentYear} ${studioDefault} — Every moment, beautifully preserved.`,
  };

  const preferences = {
    defaultAlbumAccess: current.preferences?.defaultAlbumAccess || "private",
    defaultDownload: current.preferences?.defaultDownload !== false,
    viewPreference: current.preferences?.viewPreference || "grid",
    notifyClientAccess: current.preferences?.notifyClientAccess !== false,
    notifyLowStorage: current.preferences?.notifyLowStorage !== false,
    ...current.preferences,
  };

  const security = {
    passwordUpdatedAt:
      current.security?.passwordUpdatedAt || user.updatedAt || new Date().toISOString(),
    notifyOnNewDevice: current.security?.notifyOnNewDevice !== false,
    notifyOnClientAccess: Boolean(current.security?.notifyOnClientAccess),
    sessions: [
      {
        id: "ses_current",
        current: true,
        device: "This device",
        browser: "Chrome on Windows",
        location: "Current Location",
        lastActive: new Date().toISOString(),
      },
    ],
  };

  return { profile, branding, preferences, security };
}

const getSettings = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return ensureSettings(user);
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return ensureSettings(user).profile;
};

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const emailChanged =
    data.email && data.email.trim().toLowerCase() !== user.email.toLowerCase();

  if (data.displayName) {
    user.name = data.displayName.trim();
  }
  if (data.email) {
    user.email = data.email.trim().toLowerCase();
  }

  if (!user.settings) user.settings = {};
  if (!user.settings.profile) user.settings.profile = {};

  user.settings.profile.displayName = user.name;
  user.settings.profile.email = user.email;
  if (data.imageUrl !== undefined) {
    user.settings.profile.imageUrl = data.imageUrl;
    user.settings.profile.imageName = data.imageName || "";
  }
  if (emailChanged) {
    user.settings.profile.emailVerified = false;
  }

  await user.save();
  return { ...user.settings.profile, emailChanged };
};

const getBranding = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return ensureSettings(user).branding;
};

const updateBranding = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.settings) user.settings = {};
  user.settings.branding = {
    ...ensureSettings(user).branding,
    ...data,
  };

  await user.save();
  return user.settings.branding;
};

const getPreferences = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return ensureSettings(user).preferences;
};

const updatePreferences = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.settings) user.settings = {};
  user.settings.preferences = {
    ...ensureSettings(user).preferences,
    ...data,
  };

  await user.save();
  return user.settings.preferences;
};

const getSecurity = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return ensureSettings(user).security;
};

const updateSecurity = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.settings) user.settings = {};
  if (!user.settings.security) user.settings.security = {};

  if (data.notifyOnNewDevice !== undefined) {
    user.settings.security.notifyOnNewDevice = data.notifyOnNewDevice;
  }
  if (data.notifyOnClientAccess !== undefined) {
    user.settings.security.notifyOnClientAccess = data.notifyOnClientAccess;
  }

  await user.save();
  return ensureSettings(user).security;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword) {
    const error = new Error("Enter your current password.");
    error.statusCode = 400;
    throw error;
  }
  if (!newPassword || newPassword.length < 8) {
    const error = new Error("New password must be at least 8 characters.");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(userId).select("+password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error("Your current password is incorrect.");
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 12);
  if (!user.settings) user.settings = {};
  if (!user.settings.security) user.settings.security = {};
  user.settings.security.passwordUpdatedAt = new Date();

  await user.save();
  return { passwordUpdatedAt: user.settings.security.passwordUpdatedAt };
};

const getStorage = async (userId) => {
  const albums = await Album.find({ photographer: userId }).select("_id photoCount");
  const albumIds = albums.map((a) => a._id);
  const photoCount = await Photo.countDocuments({ albumId: { $in: albumIds } });

  // Average photo size is approx 2.5MB
  const estimatedUsed = photoCount * 2.5 * 1024 * 1024;
  const totalBytes = 50 * 1024 * 1024 * 1024; // 50 GB allowance

  return {
    usedBytes: estimatedUsed,
    totalBytes,
  };
};

const getActivity = async (userId) => {
  const albums = await Album.find({ photographer: userId })
    .sort({ updatedAt: -1 })
    .limit(5);

  const activities = [];
  albums.forEach((album, idx) => {
    activities.push({
      id: `act_${album._id}_${idx}`,
      type: "album_created",
      message: `Album "${album.title}" updated`,
      createdAt: album.updatedAt ? new Date(album.updatedAt).toISOString() : new Date().toISOString(),
    });
  });

  return activities;
};

export default {
  getSettings,
  getProfile,
  updateProfile,
  getBranding,
  updateBranding,
  getPreferences,
  updatePreferences,
  getSecurity,
  updateSecurity,
  changePassword,
  getStorage,
  getActivity,
};
