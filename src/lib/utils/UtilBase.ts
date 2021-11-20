import { S3 } from 'aws-sdk'
import Redis, { Redis as RedisClient } from 'ioredis'
import { IAppConfig } from '../../interfaces'

/**
 * An abstract class to be extended by all other classes in the utils directory.
 * It contains a constructor that takes in the necessary configuration for the
 * classes to function.
 */
export abstract class UtilBase {
  /** The protected instance of the S3 Client. */
  protected s3c: S3

  /** The protected instance of the Redis Client. */
  protected red: RedisClient

  constructor(protected config: IAppConfig) {
    this.red = new Redis(config.redis)
    this.s3c = new S3({
      endpoint: config.spaces.endpoint,
      accessKeyId: config.spaces.accessKeyId,
      secretAccessKey: config.spaces.secretAccessKey
    })
  }
}
