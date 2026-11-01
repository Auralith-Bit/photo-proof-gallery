import photoService from "../services/photo.service.js";

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

const uploadPhoto = async (req, res) => {
  try {
    const albumId = req.params.albumId || req.params.id;
    console.log(
      `[POST /albums/:id/photos] Processing upload for album "${albumId}". Received file:`,
      req.file ? `${req.file.originalname} (${req.file.size}B)` : "NO FILE"
    );

    const photo = await photoService.uploadPhoto(
      albumId,
      req.file,
      req.user.userId
    );
    return res.status(201).json(photo);
  } catch (error) {
    return handleError(res, error, "Upload Photo Error:");
  }
};

const getPhotosByAlbum = async (req, res) => {
  try {
    const albumId = req.params.albumId || req.params.id;
    const photos = await photoService.getPhotosByAlbum(
      albumId,
      req.user.userId
    );
    return res.status(200).json(photos);
  } catch (error) {
    return handleError(res, error, "Get Photos Error:");
  }
};

const deletePhoto = async (req, res) => {
  try {
    const albumId = req.params.albumId || req.params.id;
    const photo = await photoService.deletePhoto(
      albumId,
      req.params.photoId,
      req.user.userId
    );
    return res.status(200).json(photo);
  } catch (error) {
    return handleError(res, error, "Delete Photo Error:");
  }
};

const setCoverPhoto = async (req, res) => {
  try {
    const albumId = req.params.albumId || req.params.id;
    const photo = await photoService.setCoverPhoto(
      albumId,
      req.params.photoId,
      req.user.userId
    );
    return res.status(200).json(photo);
  } catch (error) {
    return handleError(res, error, "Set Cover Photo Error:");
  }
};

export default {
  uploadPhoto,
  getPhotosByAlbum,
  deletePhoto,
  setCoverPhoto,
};
