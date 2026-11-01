import settingsService from "../services/settings.service.js";

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

const getSettings = async (req, res) => {
  try {
    const data = await settingsService.getSettings(req.user.userId);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Get Settings Error:");
  }
};

const getProfile = async (req, res) => {
  try {
    const data = await settingsService.getProfile(req.user.userId);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Get Profile Error:");
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = await settingsService.updateProfile(req.user.userId, req.body);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Update Profile Error:");
  }
};

const getBranding = async (req, res) => {
  try {
    const data = await settingsService.getBranding(req.user.userId);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Get Branding Error:");
  }
};

const updateBranding = async (req, res) => {
  try {
    const data = await settingsService.updateBranding(req.user.userId, req.body);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Update Branding Error:");
  }
};

const getPreferences = async (req, res) => {
  try {
    const data = await settingsService.getPreferences(req.user.userId);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Get Preferences Error:");
  }
};

const updatePreferences = async (req, res) => {
  try {
    const data = await settingsService.updatePreferences(req.user.userId, req.body);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Update Preferences Error:");
  }
};

const getSecurity = async (req, res) => {
  try {
    const data = await settingsService.getSecurity(req.user.userId);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Get Security Error:");
  }
};

const updateSecurity = async (req, res) => {
  try {
    const data = await settingsService.updateSecurity(req.user.userId, req.body);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Update Security Error:");
  }
};

const changePassword = async (req, res) => {
  try {
    const data = await settingsService.changePassword(req.user.userId, req.body);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Change Password Error:");
  }
};

const getStorage = async (req, res) => {
  try {
    const data = await settingsService.getStorage(req.user.userId);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Get Storage Error:");
  }
};

const getActivity = async (req, res) => {
  try {
    const data = await settingsService.getActivity(req.user.userId);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(res, err, "Get Activity Error:");
  }
};

export default {
  getSettings,
  getProfile,
  updateProfile,
  getBranding,
  updateBranding,
  getPreferences,
  updatePreferences,
  getSecurity,
  updateSecurity,
  changePassword,
  getStorage,
  getActivity,
};
