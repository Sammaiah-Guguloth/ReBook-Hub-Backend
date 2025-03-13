const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadToImageKit = async (file, fileName, folder = "") => {
  try {
    // if (!file || !fileName) {
    //   throw new Error("File and fileName are required for upload.");
    // }

    fileName = fileName ? fileName : "ReBookHub_image";

    // Read the file buffer from express-fileupload's file object
    const fileBuffer = file.data.toString("base64");

    // Create the upload options
    const uploadOptions = {
      file: fileBuffer,
      fileName,
      folder,
    };

    const result = await imagekit.upload(uploadOptions);

    // Generate a transformed URL using ImageKit URL generation
    const imageUrl = imagekit.url({
      path: result.filePath,
      transformation: [
        { width: 800, cropMode: "maintain_ratio" },
        { quality: 85 },
        { format: "webp" },
        { effectSharpen: true },
        { effectContrast: true },
      ],
    });

    return { imageUrl, fileId: result.fileId };
  } catch (error) {
    console.error("Image upload failed:", error.message);
    throw new Error(error.message);
  }
};

module.exports = uploadToImageKit;
