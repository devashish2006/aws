const { GetObjectCommand, S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
require('dotenv').config();

// Initialize S3 client
const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Function to get a signed URL
async function getObjectURL(key) {
    try {
        const command = new GetObjectCommand({
            Bucket: "devashish-private",
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour
        return url;
    } catch (error) {
        console.error("Error generating signed URL:", error);
        throw error;
    }
}

async function putObject(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: "devashish-private",
        Key: `/uploads/user-uploads/${filename}`,
        contentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

// Main initialization function
async function init() {
    const key = "/uploads/user-uploads/image-1735247184530.jpeg";
    console.log("URL for", key, ":", await getObjectURL(key));
    // console.log(`URL for uploading: ${await putObject(`image-${Date.now()}.jpeg`, "image/png")}`);
    
}



init().catch(console.error);
