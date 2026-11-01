import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["photographer"],
      default: "photographer",
    },
    settings: {
      profile: {
        displayName: { type: String, default: "" },
        email: { type: String, default: "" },
        emailVerified: { type: Boolean, default: true },
        imageUrl: { type: String, default: null },
        imageName: { type: String, default: "" },
      },
      branding: {
        studioName: { type: String, default: "" },
        logoUrl: { type: String, default: null },
        logoName: { type: String, default: "" },
        logoStyle: { type: String, default: "both" },
        showFooter: { type: Boolean, default: true },
        footerText: { type: String, default: "" },
      },
      preferences: {
        defaultAlbumAccess: { type: String, default: "private" },
        defaultDownload: { type: Boolean, default: true },
        viewPreference: { type: String, default: "grid" },
        notifyClientAccess: { type: Boolean, default: true },
        notifyLowStorage: { type: Boolean, default: true },
      },
      security: {
        passwordUpdatedAt: { type: Date, default: Date.now },
        notifyOnNewDevice: { type: Boolean, default: true },
        notifyOnClientAccess: { type: Boolean, default: false },
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;