const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { Readable } = require('stream');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (filePathOrBuffer, fileName = 'upload') => {
    try {
        if (!filePathOrBuffer) return null;

        let response;

        // Check if it's a buffer (from memory storage)
        if (Buffer.isBuffer(filePathOrBuffer)) {
            // Upload buffer as stream to Cloudinary
            response = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                Readable.from(filePathOrBuffer).pipe(stream);
            });
        } else {
            // It's a file path string (from disk storage)
            response = await cloudinary.uploader.upload(filePathOrBuffer, {
                resource_type: "auto"
            });

            // Remove local file if it exists
            try {
                fs.unlinkSync(filePathOrBuffer);
            } catch (e) {
                console.log("Error deleting local file:", e);
            }
        }

        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
}

module.exports = { uploadOnCloudinary };