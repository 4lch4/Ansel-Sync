import { logger } from '@4lch4/logger'
import { AWSError, S3 } from 'aws-sdk'
import { IAppConfig } from '../../interfaces'
import { validateProperties } from '../index'
import { UtilBase } from './UtilBase'

export class S3Util extends UtilBase {
  constructor(protected config: IAppConfig) {
    super(config)
  }
  /**
   * Retrieves an array (up to 1,000 items max) of folder names from the root of
   * the Ansel bucket.
   *
   * @returns An array of folder names at the root of the bucket.
   */
  getBucketFolders(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        this.s3c.listObjectsV2(
          {
            Bucket: this.config.spaces.bucketName,
            Delimiter: this.config.spaces.delimeter
          },
          (err: AWSError, data: S3.ListObjectsV2Output) => {
            if (err) reject(err)
            else {
              const parents: string[] = []

              data?.CommonPrefixes?.forEach(({ Prefix }: S3.CommonPrefix) =>
                parents.push(Prefix || '')
              )

              resolve(parents.filter(p => p !== ''))
            }
          }
        )
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * Retrieves an array (up to 1,000 items max) of file names from the specified
   * folder.
   *
   * @param prefix The name of the folder to query.
   * @returns An array of file names in the specified folder.
   */
  getFolderContents(prefix: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      try {
        this.s3c.listObjectsV2(
          { Bucket: this.config.spaces.bucketName, Prefix: prefix },
          (err: AWSError, data: S3.ListObjectsV2Output) => {
            if (err) reject(err)
            else {
              const children: string[] = []

              data?.Contents?.forEach(({ Key }: S3.Object) =>
                children.push(Key || '')
              )

              resolve(children.filter(c => c !== ''))
            }
          }
        )
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * Creates a URL that can be used to access the given image within the given
   * folder.
   *
   * @example
   * getImageUrl('alcha', 'alcha-0.png')
   *
   * "https://ansel.4lch4.tech/alcha/alcha-0.png"
   *
   * @param key The name of the folder where the image is located.
   * @param value The name of the specific image to retrieve.
   * @returns The URL where the image can be retrieved.
   */
  getImageUrl(key: string, value?: string): string {
    return value
      ? `${this.config.imagesBaseUrl}/${key}/${value}`
      : `${this.config.imagesBaseUrl}/${key}`
  }

  /**
   * Creates a URL that can be used to access the given image within the given
   * folder for all of the given image names.
   *
   * @example
   * For example, if the folder is 'alcha' and the images are 'alcha-0.png' and
   * 'alcha-1.gif', then if you run the function like shown, you'll get a
   * response like shown.
   *
   * Function Call:
   * getImageUrls('alcha', ['alcha-0.png', 'alcha-1.gif'])
   *
   * Response Array:
   * [
   *  'https://ansel.4lch4.tech/alcha/alcha-0.png',
   *  'https://ansel.4lch4.tech/alcha/alcha-1.gif'
   * ] in return.
   *
   * @param key The name of the folder where the images are located.
   * @param values The names of the images to retrieve.
   *
   * @returns An array of URLs where the images can be retrieved.
   */
  getImageUrls(key: string, values: string[]): string[] {
    return values.map(value => this.getImageUrl(key, value))
  }

  getKeyValue(key: string, data: S3.ListObjectsV2Output) {
    const start = (data.Prefix ? data.Prefix.length : key.indexOf('/')) + 1

    return key.substring(start)
  }

  formatBucketChildrenResponse(data: S3.ListObjectsV2Output) {
    const contents: any[] = []

    if (
      validateProperties(data, ['Contents', 'KeyCount', 'MaxKeys']) &&
      // @ts-ignore The above call ensures these are present.
      data.KeyCount < data.MaxKeys
    ) {
      // @ts-ignore The above ensureProperties() call validates the presence of
      // the properties, so we can safely assume they exist here.
      for (const { Key } of data.Contents) {
        if (Key) {
          const valStart =
            (data.Prefix ? data.Prefix.length : Key.indexOf('/')) + 1

          contents.push(Key.substring(valStart))
        } else
          logger.warn('Key is not present for formatBucketChildrenResponse...')
      }
    } else {
      logger.warn(
        'Required properties are not present for formatBucketChildrenResponse...'
      )
    }

    return contents
  }
}
