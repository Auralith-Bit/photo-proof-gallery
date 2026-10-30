export const mockProfile = {
  displayName: "Alex Morgan",
  email: "studio@frameora.app",
  emailVerified: true,
  imageUrl: null,
  imageName: "",
};

export const mockSecurity = {
  passwordUpdatedAt: "2025-09-12T09:00:00Z",
  notifyOnNewDevice: true,
  notifyOnClientAccess: false,
  sessions: [
    { id: "ses_current", current: true, device: "This device", browser: "Chrome on Windows", location: "New York, US", lastActive: new Date().toISOString() },
    { id: "ses_2", current: false, device: "MacBook Pro", browser: "Safari on macOS", location: "New York, US", lastActive: "2025-10-28T18:40:00Z" },
    { id: "ses_3", current: false, device: "iPhone 15", browser: "Frameora app", location: "Boston, US", lastActive: "2025-10-27T07:15:00Z" },
  ],
};

export const mockBranding = {
  studioName: "Morgan Studio",
  logoUrl: null,
  logoName: "",
  logoStyle: "both", // 'logo' | 'name' | 'both'
  showFooter: true,
  footerText: "© Morgan Studio — Every moment, beautifully preserved.",
};

export const mockPreferences = {
  defaultAlbumAccess: "private", // 'private' | 'share'
  defaultDownload: true,
  viewPreference: "grid", // 'grid' | 'list'
  notifyClientAccess: true,
  notifyLowStorage: true,
};