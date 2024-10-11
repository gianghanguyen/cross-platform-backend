import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { generateFileName } from '~/utils/file-name';

const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || '',
};

const s3Client = new S3Client({ credentials: credentials });

export const presignedUploadUrl = async (fileName: string) => {
  const savedFileName = generateFileName(fileName);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    ACL: 'public-read' as const,
    ContentType: 'multipart/form-data',
    Key: savedFileName,
    Expired: new Date(new Date().getTime() + 60 * 1000 * 5),
  };
  const url = await getSignedUrl(s3Client, new PutObjectCommand(params));
  return { url, fileUrl: `${process.env.AWS_FILE_URL}/${savedFileName}` };
};
