import { v2 as cloudinary } from 'cloudinary';

const hasCloudinaryConfig = process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
}

export async function uploadImage(base64Image: string): Promise<string | null> {
    if (!hasCloudinaryConfig) {
        console.log('☁️ [DEV] Cloudinary no configurado - imagen no subida');
        return null;
    }
    
    try {
        const result = await cloudinary.uploader.upload(base64Image, {
            resource_type: "image",
            discard_original_filename: true,
            width: 800,
            crop: 'limit'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error subiendo imagen a Cloudinary:', error);
        return null;
    }
}

export { cloudinary };
