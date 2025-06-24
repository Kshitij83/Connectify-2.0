import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadAudioToS3 = async (base64Audio, fileName) => {
  const buffer = Buffer.from(base64Audio.split(',')[1], 'base64');
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `audio/${Date.now()}_${fileName}`,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: 'audio/webm',
  };
  const data = await s3.upload(params).promise();
  return data.Location; // S3 URL
};
