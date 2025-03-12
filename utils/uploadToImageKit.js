const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = async (
  file,
  fileName,
  folder = "",
  transformationOptions = null
) => {
  try {
    if (!file || !fileName) {
      throw new Error("File and fileName are required for upload.");
    }

    const result = await imagekit.upload({
      file,
      fileName,
      folder,
      if(transformationOptions) {
        uploadOptions.transformation = [transformationOptions];
      },
    });

    return result.url; // Returning the uploaded file URL
  } catch (error) {
    console.error("Image upload failed:", error.message);
    throw new Error(error.message);
  }
};

module.exports = uploadToImageKit;
