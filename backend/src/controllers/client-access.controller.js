import clientAccessService from "../services/client-access.service.js";

const resolveAlbumByToken = async (req, res) => {
  try {
    const metadata = await clientAccessService.resolveAlbumByToken(req.params.accessToken);
    return res.status(200).json(metadata);
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      code: error.code || "INTERNAL_ERROR",
      message: error.message || "Something went wrong.",
    });
  }
};

const verifyAlbumAccess = async (req, res) => {
  try {
    const result = await clientAccessService.verifyAlbumAccess(
      req.params.accessToken,
      req.body?.password
    );
    return res.status(200).json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    const body = {
      code: error.code || "INTERNAL_ERROR",
      message: error.message || "Something went wrong.",
    };
    if (error.retryAfter) {
      body.retryAfter = error.retryAfter;
    }
    return res.status(status).json(body);
  }
};

export default {
  resolveAlbumByToken,
  verifyAlbumAccess,
};
