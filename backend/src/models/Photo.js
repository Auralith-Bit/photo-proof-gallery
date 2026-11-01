import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      default: 1200,
    },
    height: {
      type: Number,
      default: 800,
    },
    isCover: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    customId: {
      type: String,
      sparse: true,
      index: true,
    },
    cloudinaryPublicId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

photoSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

photoSchema.set("toObject", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;
