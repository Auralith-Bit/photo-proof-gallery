import clientService from "../services/client.service.js";

const handleError = (res, error, defaultMsg) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  console.error(defaultMsg, error);
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};

const getClients = async (req, res) => {
  try {
    const clients = await clientService.getClients(req.user?.userId);
    return res.status(200).json(clients);
  } catch (error) {
    return handleError(res, error, "Get Clients Error:");
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id, req.user?.userId);
    return res.status(200).json(client);
  } catch (error) {
    return handleError(res, error, "Get Client By Id Error:");
  }
};

const createClient = async (req, res) => {
  try {
    const client = await clientService.createClient(req.body, req.user?.userId);
    return res.status(201).json(client);
  } catch (error) {
    return handleError(res, error, "Create Client Error:");
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body, req.user?.userId);
    return res.status(200).json(client);
  } catch (error) {
    return handleError(res, error, "Update Client Error:");
  }
};

const archiveClient = async (req, res) => {
  try {
    const client = await clientService.archiveClient(req.params.id, req.user?.userId);
    return res.status(200).json(client);
  } catch (error) {
    return handleError(res, error, "Archive Client Error:");
  }
};

const restoreClient = async (req, res) => {
  try {
    const client = await clientService.restoreClient(req.params.id, req.user?.userId);
    return res.status(200).json(client);
  } catch (error) {
    return handleError(res, error, "Restore Client Error:");
  }
};

const deleteClient = async (req, res) => {
  try {
    const client = await clientService.deleteClient(req.params.id, req.user?.userId);
    return res.status(200).json(client);
  } catch (error) {
    return handleError(res, error, "Delete Client Error:");
  }
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
