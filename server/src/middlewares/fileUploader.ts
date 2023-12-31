import multer from 'multer';
import { convertMbToBytes } from '@/lib/utils';
import { IMAGE_SIZE_LIMIT_IN_MB } from '@/lib/constants';

const fileUploader = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, callback) {
    if (file.mimetype.split('/')[0] !== 'image') {
      return callback(null, false);
    }
    return callback(null, true);
  },
  limits: {
    fileSize: convertMbToBytes(IMAGE_SIZE_LIMIT_IN_MB),
  },
});

export default fileUploader;
