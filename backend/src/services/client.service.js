import mongoose from "mongoose";
import Client from "../models/Client.js";
import Album from "../models/Album.js";
import User from "../models/User.js";

function buildClientQuery(clientId) {
  return mongoose.Types.ObjectId.isValid(clientId)
    ? { $or: [{ _id: clientId }, { customId: clientId }] }
    : { customId: clientId };
}

async function decorateClient(clientDoc) {
  if (!clientDoc) return null;
  const obj = clientDoc.toObject ? clientDoc.toObject() : { ...clientDoc };
  const idStr = (obj._id || obj.id)?.toString();
  obj.id = idStr;
  delete obj._id;
  delete obj.__v;

  // Compute albumCount and latestAlbum
  const albums = await Album.find({ clientId: obj.id })
    .sort({ eventDate: -1, updatedAt: -1 })
    .select("title eventDate");

  obj.albumCount = albums.length;
  obj.latestAlbum =
    albums.length > 0
      ? {
          id: albums[0]._id.toString(),
          title: albums[0].title,
          eventDate: albums[0].eventDate
            ? new Date(albums[0].eventDate).toISOString().slice(0, 10)
            : null,
        }
      : null;

  return obj;
}

const getClients = async (userId) => {
  if (!userId) return [];
  const clients = await Client.find({ photographer: userId }).sort({ updatedAt: -1, createdAt: -1 });
  const decorated = await Promise.all(clients.map(decorateClient));
  return decorated.sort((a, b) => {
    if (a.status === b.status) return new Date(b.updatedAt) - new Date(a.updatedAt);
    return a.status === "archived" ? 1 : -1;
  });
};

const getClientById = async (clientId, userId) => {
  const client = await Client.findOne(buildClientQuery(clientId));
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }
  return await decorateClient(client);
};

const createClient = async (data, userId) => {
  if (!data.fullName?.trim() || data.fullName.trim().length < 2) {
    const error = new Error("Client name must be at least 2 characters.");
    error.statusCode = 400;
    throw error;
  }

  let photographerId = userId;
  if (!photographerId) {
    const firstUser = await User.findOne();
    if (firstUser) photographerId = firstUser._id;
  }

  const client = await Client.create({
    fullName: data.fullName.trim(),
    email: data.email?.trim() || "",
    phone: data.phone?.trim() || "",
    notes: data.notes?.trim() || "",
    status: data.status || "active",
    photographer: photographerId,
  });

  return await decorateClient(client);
};

const updateClient = async (clientId, data, userId) => {
  const client = await Client.findOne(buildClientQuery(clientId));
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.fullName !== undefined) {
    if (!data.fullName?.trim() || data.fullName.trim().length < 2) {
      const error = new Error("Client name must be at least 2 characters.");
      error.statusCode = 400;
      throw error;
    }
    client.fullName = data.fullName.trim();
  }

  if (data.email !== undefined) client.email = data.email?.trim() || "";
  if (data.phone !== undefined) client.phone = data.phone?.trim() || "";
  if (data.notes !== undefined) client.notes = data.notes?.trim() || "";
  if (data.status !== undefined) client.status = data.status;

  await client.save();
  return await decorateClient(client);
};

const archiveClient = async (clientId, userId) => {
  const client = await Client.findOne(buildClientQuery(clientId));
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }
  client.status = "archived";
  await client.save();
  return await decorateClient(client);
};

const restoreClient = async (clientId, userId) => {
  const client = await Client.findOne(buildClientQuery(clientId));
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }
  client.status = "active";
  await client.save();
  return await decorateClient(client);
};

const deleteClient = async (clientId, userId) => {
  const client = await Client.findOne(buildClientQuery(clientId));
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  const removed = await decorateClient(client);
  await Client.deleteOne({ _id: client._id });
  // Albums survive but become unassigned
  await Album.updateMany({ clientId: client._id }, { $set: { clientId: null } });

  return removed;
};

export default {
  getClients,
  getClientById,
  createClient,
  updateClient,
  archiveClient,
  restoreClient,
  deleteClient,
};
