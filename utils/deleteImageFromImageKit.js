const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const deleteImage = async (fileId) => {
  try {
    const response = await imagekit.deleteFile(fileId);
    console.log(`Image deleted successfully: ${fileId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting image: ${error.message}`);
    throw error;
  }
};

module.exports = deleteImage;
