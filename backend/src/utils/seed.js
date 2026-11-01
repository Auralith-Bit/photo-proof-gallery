import Album from "../models/Album.js";
import User from "../models/User.js";

export const seedInitialAlbums = async () => {
  try {
    const existing = await Album.findOne({ customId: "alb_01" });
    if (!existing) {
      const user = await User.findOne();
      if (!user) return;

      const initialAlbums = [
        {
          customId: "alb_01",
          title: "Miller-Jones Summer Wedding",
          description: "Full day coverage at the botanical gardens.",
          eventDate: new Date("2025-08-15"),
          coverPhotoUrl: "https://picsum.photos/seed/wedding1/800/600",
          status: "active",
          photoCount: 12,
          photographer: user._id,
          accessToken: "tok_miller_wedding",
        },
        {
          customId: "alb_02",
          title: "Corporate Headshots - TechCorp",
          description: "Executive team and staff headshots.",
          eventDate: new Date("2025-09-20"),
          coverPhotoUrl: "https://picsum.photos/seed/corp1/800/600",
          status: "draft",
          photoCount: 6,
          photographer: user._id,
          accessToken: "tok_techcorp_headshots",
        },
        {
          customId: "alb_03",
          title: "Sarah's 1st Birthday",
          description: "Smash cake and studio portraits.",
          eventDate: new Date("2024-11-10"),
          coverPhotoUrl: "https://picsum.photos/seed/bday1/800/600",
          status: "archived",
          photoCount: 8,
          photographer: user._id,
          accessToken: "tok_sarah_birthday",
        },
      ];

      await Album.insertMany(initialAlbums);
      console.log("Seeded initial studio albums.");
    }
  } catch (err) {
    console.warn("Seeding error:", err.message);
  }
};

export default seedInitialAlbums;
