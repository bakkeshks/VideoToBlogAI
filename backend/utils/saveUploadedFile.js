const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");

const saveUploadedFile = async (file) => {
  try {
    const extension = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${extension}`;
    const uploadPath = path.join("uploads", uniqueFileName);

    if (file.mimetype.startsWith("video")) {
      console.log("Uploading a video file");
    } else if (file.mimetype.startsWith("audio")) {
      console.log("Uploading an audio file");
    } else {
      throw new Error(
        "Unsupported file format. Please upload a video or audio file."
      );
    }

    // Move the file from the temporary location to the uploads folder
    await fs.rename(file.path, uploadPath);

    return uploadPath;
  } catch (error) {
    console.error(`Error saving uploaded file: ${error}`);
    throw error;
  }
};

module.exports = { saveUploadedFile };
