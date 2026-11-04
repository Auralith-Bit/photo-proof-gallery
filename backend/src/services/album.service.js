import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Album from "../models/Album.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import Photo from "../models/Photo.js";

function buildAlbumQuery(albumId) {
  return mongoose.Types.ObjectId.isValid(albumId)
    ? { $or: [{ _id: albumId }, { customId: albumId }] }
    : { customId: albumId };
}

function formatPhotoResponse(photo) {
  if (!photo) return null;
  const obj = photo.toObject ? photo.toObject() : { ...photo };
  obj.id = (obj._id || obj.id)?.toString();
  obj.albumId = obj.albumId?.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

function formatAlbumResponse(album) {
  if (!album) return null;
  const obj = album.toObject ? album.toObject() : { ...album };

  obj.id = (obj._id || obj.id)?.toString();
  delete obj._id;
  delete obj.__v;
  delete obj.password;

  if (obj.clientId && typeof obj.clientId === "object" && obj.clientId.fullName) {
    obj.clientName = obj.clientId.fullName;
    obj.clientId = (obj.clientId._id || obj.clientId.id)?.toString();
  } else {
    obj.clientName = obj.clientName || null;
    obj.clientId = obj.clientId ? obj.clientId.toString() : null;
  }

  obj.hasPassword = Boolean(obj.hasPassword !== undefined ? obj.hasPassword : album.password);
  obj.photoCount = typeof obj.photoCount === "number" ? obj.photoCount : 0;
  obj.coverPhotoUrl = obj.coverPhotoUrl || null;
  obj.description = obj.description || "";
  obj.eventDate = obj.eventDate
    ? new Date(obj.eventDate).toISOString().slice(0, 10)
    : null;
  obj.accessEnabled = obj.accessEnabled !== false;
  obj.allowDownload = obj.allowDownload !== false;
  obj.status = obj.status || "active";
  obj.accessToken = obj.accessToken || `tok_${(obj.id || "").slice(-8)}`;

  return obj;
}

const getAlbums = async (userId) => {
  if (!userId) return [];
  const albums = await Album.find({ photographer: userId })
    .sort({ updatedAt: -1, createdAt: -1 })
    .populate("clientId", "fullName");

  return albums.map(formatAlbumResponse);
};

const getAlbumById = async (albumId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId)).populate(
    "clientId",
    "fullName"
  );

  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  const photos = await Photo.find({ albumId: album._id }).sort({ createdAt: 1 });
  const formatted = formatAlbumResponse(album);
  formatted.photos = photos.map(formatPhotoResponse);

  return formatted;
};

const createAlbum = async (data, userId) => {
  const {
    title,
    description = "",
    eventDate = null,
    location = "",
    clientMode,
    clientId,
    newClientName,
    password,
    status,
    accessEnabled,
    allowDownload,
  } = data;

  if (!title?.trim() || title.trim().length < 2) {
    const error = new Error("Album title must be at least 2 characters.");
    error.statusCode = 400;
    throw error;
  }

  let photographerId = userId;
  if (userId) {
    const photographer = await User.findById(userId);
    if (photographer) photographerId = photographer._id;
  }

  if (!photographerId) {
    const firstUser = await User.findOne();
    if (firstUser) photographerId = firstUser._id;
  }

  let assignedClientId = null;
  let clientName = null;

  if (clientMode === "new" && newClientName?.trim()) {
    if (newClientName.trim().length < 2) {
      const error = new Error("Client name must be at least 2 characters.");
      error.statusCode = 400;
      throw error;
    }
    const client = await Client.create({
      fullName: newClientName.trim(),
      photographer: photographerId,
      status: "active",
    });
    assignedClientId = client._id;
    clientName = client.fullName;
  } else if (clientId) {
    const clientQuery = mongoose.Types.ObjectId.isValid(clientId)
      ? { _id: clientId }
      : { customId: clientId };
    const client = await Client.findOne(clientQuery);
    if (client) {
      assignedClientId = client._id;
      clientName = client.fullName;
    } else if (mongoose.Types.ObjectId.isValid(clientId)) {
      assignedClientId = clientId;
    }
  }

  let hashedPassword = null;
  if (password) {
    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters.");
      error.statusCode = 400;
      throw error;
    }
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const newAlbum = await Album.create({
    title: title.trim(),
    description: description?.trim() || "",
    eventDate: eventDate ? new Date(eventDate) : null,
    location: location?.trim() || "",
    photographer: photographerId,
    clientId: assignedClientId,
    password: hashedPassword,
    hasPassword: Boolean(hashedPassword),
    status: status || "active",
    accessEnabled: accessEnabled !== undefined ? accessEnabled : true,
    allowDownload: allowDownload !== undefined ? allowDownload : true,
  });

  const formatted = formatAlbumResponse(newAlbum);
  if (clientName) formatted.clientName = clientName;
  return formatted;
};

const updateAlbum = async (albumId, data, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.title !== undefined) {
    if (!data.title?.trim() || data.title.trim().length < 2) {
      const error = new Error("Album title must be at least 2 characters.");
      error.statusCode = 400;
      throw error;
    }
    album.title = data.title.trim();
  }

  if (data.description !== undefined) {
    album.description = data.description ? data.description.trim() : "";
  }

  if (data.eventDate !== undefined) {
    album.eventDate = data.eventDate ? new Date(data.eventDate) : null;
  }

  if (data.location !== undefined) {
    album.location = data.location ? data.location.trim() : "";
  }

  if (data.clientMode === "new" && data.newClientName?.trim()) {
    const client = await Client.create({
      fullName: data.newClientName.trim(),
      photographer: userId || album.photographer,
      status: "active",
    });
    album.clientId = client._id;
  } else if (data.clientId !== undefined) {
    if (!data.clientId || data.clientId === "") {
      album.clientId = null;
    } else if (mongoose.Types.ObjectId.isValid(data.clientId)) {
      album.clientId = data.clientId;
    } else {
      const client = await Client.findOne({ customId: data.clientId });
      album.clientId = client ? client._id : null;
    }
  }

  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

const archiveAlbum = async (albumId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  album.status = "archived";
  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

const draftAlbum = async (albumId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  album.status = "draft";
  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

const restoreAlbum = async (albumId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  album.status = "active";
  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

const deleteAlbum = async (albumId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId)).populate(
    "clientId",
    "fullName"
  );
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  const removed = formatAlbumResponse(album);
  await Album.deleteOne({ _id: album._id });
  await Photo.deleteMany({ albumId: album._id });

  return removed;
};

const setAccessEnabled = async (albumId, enabled, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  album.accessEnabled = Boolean(enabled);
  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

const setDownloadPermission = async (albumId, allow, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  album.allowDownload = Boolean(allow);
  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

const setAlbumPassword = async (albumId, password, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  if (!password || password.length < 6) {
    const error = new Error("Password must be at least 6 characters.");
    error.statusCode = 400;
    throw error;
  }

  album.password = await bcrypt.hash(password, 10);
  album.hasPassword = true;
  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

const removeAlbumPassword = async (albumId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  album.password = null;
  album.hasPassword = false;
  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

const regenerateAlbumLink = async (albumId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  album.accessToken = `tok_${crypto.randomBytes(5).toString("hex")}`;
  await album.save();
  await album.populate("clientId", "fullName");
  return formatAlbumResponse(album);
};

export default {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  archiveAlbum,
  draftAlbum,
  restoreAlbum,
  deleteAlbum,
  setAccessEnabled,
  setDownloadPermission,
  setAlbumPassword,
  removeAlbumPassword,
  regenerateAlbumLink,
};
