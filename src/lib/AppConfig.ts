import { IAppConfig } from '../interfaces'

export const AppConfig: IAppConfig = {
  spaces: {
    endpoint: process.env.SPACES_ENDPOINT || '',
    bucketName: process.env.SPACES_BUCKET_NAME || '',
    accessKeyId: process.env.SPACES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY || '',
    delimeter: process.env.SPACES_DELIMETER || ''
  },
  redis: process.env.REDIS_CONNECTION_STRING || '',
  imagesBaseUrl: process.env.IMAGES_BASE_URL || ''
}
