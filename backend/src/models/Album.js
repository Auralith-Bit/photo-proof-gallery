import mongoose from "mongoose";
import crypto from "crypto";

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Album title is required."],
      trim: true,
      minlength: [2, "Title must be at least 2 characters."],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    eventDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    coverPhotoUrl: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },
    photoCount: {
      type: Number,
      default: 0,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    photographer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accessToken: {
      type: String,
      unique: true,
      index: true,
      default: () => `tok_${crypto.randomBytes(5).toString("hex")}`,
    },
    accessEnabled: {
      type: Boolean,
      default: true,
    },
    allowDownload: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      select: false,
      default: null,
    },
    hasPassword: {
      type: Boolean,
      default: false,
    },
    customId: {
      type: String,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

albumSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.hasPassword = Boolean(this.password);
  }
});

albumSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

albumSchema.set("toObject", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const Album = mongoose.model("Album", albumSchema);

export default Album;
