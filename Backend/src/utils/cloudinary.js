const cloudinary = require('cloudinary').v2;
const fs = require('fs');


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
          console.warn('No file path provided to Cloudinary');
          return null;
        }
        
        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        
        console.log('File uploaded to Cloudinary:', response.secure_url);
        
        // Clean up temp file after successful upload
        try {
          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
          }
        } catch (err) {
          console.warn('Could not delete temp file:', err.message);
        }
        
        return response;

    } catch (error) {
        console.error('Cloudinary upload error:', error.message);
        
        // Try to clean up temp file even on error
        try {
          if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
          }
        } catch (err) {
          console.warn('Could not delete temp file after error:', err.message);
        }
        
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
}

module.exports = { uploadOnCloudinary };