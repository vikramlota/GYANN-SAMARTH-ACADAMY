const cloudinary = require('cloudinary').v2;
const fs = require('fs');


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // SUCCESS: File uploaded. Now remove local file.
        // We use fs.unlinkSync because it works on both /tmp and ./public
        fs.unlinkSync(localFilePath); 
        return response;

    } catch (error) {
        // ERROR: Remove the local file so /tmp doesn't fill up
        // Wrap in try/catch in case file doesn't exist
        try {
            fs.unlinkSync(localFilePath);
        } catch (e) { 
            console.log("Error deleting file:", e); 
        }
        return null;
    }
}
module.exports = { uploadOnCloudinary };