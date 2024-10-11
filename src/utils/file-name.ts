import { v4 as uuidv4 } from 'uuid';

export const generateFileName = (fileName: string) => {
  const ext = fileName.split('.').pop();
  return `${fileName.substring(0, 10)}-${uuidv4()}.${ext}`;
};
