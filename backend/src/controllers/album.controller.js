import albumService from "../services/album.service.js";

const handleError = (res, error, defaultMsg) => {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }
  console.error(defaultMsg, error);
  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};

const getAlbums = async (req, res) => {
  try {
    const albums = await albumService.getAlbums(req.user.userId);
    return res.status(200).json(albums);
  } catch (error) {
    return handleError(res, error, "Get Albums Error:");
  }
};

const getAlbumById = async (req, res) => {
  try {
    const album = await albumService.getAlbumById(req.params.id, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Get Album By Id Error:");
  }
};

const createAlbum = async (req, res) => {
  try {
    const album = await albumService.createAlbum(req.body, req.user.userId);
    return res.status(201).json(album);
  } catch (error) {
    return handleError(res, error, "Create Album Error:");
  }
};

const updateAlbum = async (req, res) => {
  try {
    const album = await albumService.updateAlbum(req.params.id, req.body, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Update Album Error:");
  }
};

const archiveAlbum = async (req, res) => {
  try {
    const album = await albumService.archiveAlbum(req.params.id, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Archive Album Error:");
  }
};

const restoreAlbum = async (req, res) => {
  try {
    const album = await albumService.restoreAlbum(req.params.id, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Restore Album Error:");
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const album = await albumService.deleteAlbum(req.params.id, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Delete Album Error:");
  }
};

const setAccessEnabled = async (req, res) => {
  try {
    const enabled = req.body.enabled !== undefined ? req.body.enabled : true;
    const album = await albumService.setAccessEnabled(req.params.id, enabled, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Set Access Error:");
  }
};

const setDownloadPermission = async (req, res) => {
  try {
    const allow = req.body.allow !== undefined ? req.body.allow : true;
    const album = await albumService.setDownloadPermission(req.params.id, allow, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Set Download Permission Error:");
  }
};

const setAlbumPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const album = await albumService.setAlbumPassword(req.params.id, password, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Set Album Password Error:");
  }
};

const removeAlbumPassword = async (req, res) => {
  try {
    const album = await albumService.removeAlbumPassword(req.params.id, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Remove Album Password Error:");
  }
};

const regenerateAlbumLink = async (req, res) => {
  try {
    const album = await albumService.regenerateAlbumLink(req.params.id, req.user.userId);
    return res.status(200).json(album);
  } catch (error) {
    return handleError(res, error, "Regenerate Album Link Error:");
  }
};

export default {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  archiveAlbum,
  restoreAlbum,
  deleteAlbum,
  setAccessEnabled,
  setDownloadPermission,
  setAlbumPassword,
  removeAlbumPassword,
  regenerateAlbumLink,
};
