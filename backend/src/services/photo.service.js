import mongoose from "mongoose";
import cloudinary, { getCloudinary } from "../config/cloudinary.js";
import Album from "../models/Album.js";
import Photo from "../models/Photo.js";

function buildAlbumQuery(albumId) {
  return mongoose.Types.ObjectId.isValid(albumId)
    ? { $or: [{ _id: albumId }, { customId: albumId }] }
    : { customId: albumId };
}

function buildPhotoQuery(photoId, albumId) {
  const query = mongoose.Types.ObjectId.isValid(photoId)
    ? { _id: photoId }
    : { customId: photoId };
  if (albumId) {
    query.albumId = albumId;
  }
  return query;
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

const uploadToCloudinary = (cldInstance, buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cldInstance.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

const uploadPhoto = async (albumId, file, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  if (!file || !file.buffer) {
    const error = new Error("No image file provided.");
    error.statusCode = 400;
    throw error;
  }

  const cld = getCloudinary();

  console.log(`Uploading photo "${file.originalname}" (${file.size} bytes) to Cloudinary for album: "${album.title}"`);

  let uploadResult;
  try {
    uploadResult = await uploadToCloudinary(cld, file.buffer, {
      folder: `photostudio/albums/${album._id}`,
      resource_type: "image",
    });
  } catch (cloudErr) {
    console.error("Cloudinary upload error details:", cloudErr);
    const error = new Error(
      cloudErr.message?.includes("cloud_name")
        ? "Cloudinary is not configured. Please check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend .env."
        : `Cloudinary upload failed: ${cloudErr.message || "Unknown error"}`
    );
    error.statusCode = 502;
    throw error;
  }

  const secureUrl = uploadResult.secure_url;
  const thumbnailUrl = cld.url(uploadResult.public_id, {
    width: 400,
    height: 300,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
    secure: true,
  });

  const existingPhotosCount = await Photo.countDocuments({ albumId: album._id });
  const isFirstPhoto = existingPhotosCount === 0 || !album.coverPhotoUrl;

  const photo = await Photo.create({
    albumId: album._id,
    filename: file.originalname || "photo.jpg",
    url: secureUrl,
    thumbnailUrl: thumbnailUrl || secureUrl,
    width: uploadResult.width || 1200,
    height: uploadResult.height || 800,
    isCover: isFirstPhoto,
    cloudinaryPublicId: uploadResult.public_id,
  });

  if (isFirstPhoto) {
    album.coverPhotoUrl = photo.thumbnailUrl;
  }

  if (!album.photographer && userId) {
    album.photographer = userId;
  }

  album.photoCount = existingPhotosCount + 1;
  album.updatedAt = new Date();
  await album.save();

  console.log(`Photo uploaded successfully to Cloudinary: ${photo.id}`);
  return formatPhotoResponse(photo);
};

const getPhotosByAlbum = async (albumId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  const photos = await Photo.find({ albumId: album._id }).sort({ createdAt: 1 });
  return photos.map(formatPhotoResponse);
};

const deletePhoto = async (albumId, photoId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  const photo = await Photo.findOne(buildPhotoQuery(photoId, album._id));
  if (!photo) {
    const error = new Error("Photo not found");
    error.statusCode = 404;
    throw error;
  }

  if (photo.cloudinaryPublicId) {
    try {
      const cld = getCloudinary();
      await cld.uploader.destroy(photo.cloudinaryPublicId);
    } catch (err) {
      console.warn("Could not delete from Cloudinary:", err.message);
    }
  }

  const removed = formatPhotoResponse(photo);
  await Photo.deleteOne({ _id: photo._id });

  if (photo.isCover) {
    const nextPhoto = await Photo.findOne({ albumId: album._id }).sort({ createdAt: 1 });
    if (nextPhoto) {
      nextPhoto.isCover = true;
      await nextPhoto.save();
      album.coverPhotoUrl = nextPhoto.thumbnailUrl;
    } else {
      album.coverPhotoUrl = null;
    }
  }

  album.photoCount = await Photo.countDocuments({ albumId: album._id });
  album.updatedAt = new Date();
  await album.save();

  return removed;
};

const setCoverPhoto = async (albumId, photoId, userId) => {
  const album = await Album.findOne(buildAlbumQuery(albumId));
  if (!album) {
    const error = new Error("Album not found");
    error.statusCode = 404;
    throw error;
  }

  const photo = await Photo.findOne(buildPhotoQuery(photoId, album._id));
  if (!photo) {
    const error = new Error("Photo not found");
    error.statusCode = 404;
    throw error;
  }

  await Photo.updateMany({ albumId: album._id }, { $set: { isCover: false } });

  photo.isCover = true;
  await photo.save();

  album.coverPhotoUrl = photo.thumbnailUrl;
  album.updatedAt = new Date();
  await album.save();

  return formatPhotoResponse(photo);
};

export default {
  uploadPhoto,
  getPhotosByAlbum,
  deletePhoto,
  setCoverPhoto,
};
