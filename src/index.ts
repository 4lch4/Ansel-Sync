import { logger } from '@4lch4/logger'
import { AppConfig, RedisUtil, S3Util } from './lib'

const redis = new RedisUtil(AppConfig)
const s3 = new S3Util(AppConfig)

interface IResults {
  [key: string]: 'OK' | { error: unknown }
}

// logger.info('Util classes instantiated...')

async function main(): Promise<IResults> {
  try {
    const folders = await s3.getBucketFolders()
    const responses: IResults = {}

    for (const folder of folders) {
      // logger.debug(`Processing folder ${folder}...`)

      const folderName = folder.substring(0, folder.lastIndexOf('/'))
      const images = await s3.getFolderContents(folder)
      const imageUrls: string[] = []

      // logger.debug(
      //   `getFolderContents completed successfully and retrieved ${images.length} images...`
      // )

      for (const image of images) imageUrls.push(s3.getImageUrl(image))

      /**
       * Attempt to store the image urls in Redis and assign the response in the
       * responses object.
       */
      responses[folderName] = await redis.setValues(folderName, imageUrls)

      logger.debug(
        `Finished processing ${images.length} images for ${folderName}`
      )
    }

    return responses
  } catch (error) {
    throw error
  }
}

async function validateResults(results: IResults) {
  const failures = []

  for (const result in results) {
    if (results[result] !== 'OK') failures.push(result)
  }

  return failures
}

// const main = async () => {}

// const

main()
  .then(result => {
    validateResults(result)
      .then(failures => {
        if (failures.length > 0) {
          logger.error(`${failures.length} requests failed:`)
          logger.error(failures)
        } else {
          logger.success(`All folders processed successfully!`)
          process.exit(0)
        }
      })
      .catch(err => logger.error(err))
  })
  .catch(error => logger.error(error))

// const s3Util = new S3Util(AppConfig)

// const main = async () => {
//   const parents = await s3Util.getBucketFolders()

//   for (let x = 0; x < 2; x++) {
//     const children = await s3Util.getFolderContents(parents[x])
//     // logger.info(`${parents[x]} has ${children.length} children`)
//     for (const child of children) {
//       logger.info(`imageUrl = ${getImageUrl(child)}`)
//     }
//   }
// }

// main()
//   .then(() => {
//     logger.success('Execution complete!')
//   })
//   .catch(err => logger.error(err))

// s3Util
//   .getBucketParents()
//   .then(parents => {
//     logger.info(parents)

//     for (let x = 0; x < 2; x++) {
//       s3Util.getBucketChildren(parents[x]).then(children => {
//         logger.info(children)
//       })
//       x++
//     }
//     logger.success('Execution complete!')
//   })
//   .catch(err => {
//     logger.error(err)
//     logger.error('Execution failed!')
//   })

// import { formatBucketChildrenResponse } from './lib'

// const ConfigOpts: S3.ClientConfiguration = {
//   endpoint: 'nyc3.digitaloceanspaces.com',
//   accessKeyId: 'LGTV7KOWVMLNZ2DJSFFK',
//   secretAccessKey: 'Y8Il6pkFKKIo16HcakFRKsRATtXz0VB88YKDBczmlO0'
// }

// const client = new S3({
//   endpoint: ConfigOpts.endpoint,
//   credentials: {
//     accessKeyId: ConfigOpts.accessKeyId || '',
//     secretAccessKey: ConfigOpts.secretAccessKey || ''
//   }
// })

// async function getBucketNames(): Promise<string[] | any> {
//   return new Promise((resolve, reject) => {
//     try {
//       client.listBuckets((err: AWSError, data: S3.ListBucketsOutput) => {
//         if (err) reject(err)
//         else if (data.Buckets) {
//           const res = data.Buckets.map(bucket => bucket.Name)
//           resolve(res)
//         } else resolve(data)
//       })
//     } catch (err) {
//       reject(err)
//     }
//   })
// }

// getBucketNames()
//   .then(res => {
//     logger.success('Execution complete!')
//     // logger.info(JSON.stringify(res, null, 2))
//     logger.info(res)
//   })
//   .catch(err => {
//     logger.error(err)
//   })

/**
 * Retrieves an array of folder names from the root of the Ansel bucket.
 *
 * @returns An array of folder names at the root of the bucket.
 */
// async function getBucketParents(): Promise<string[]> {
//   return new Promise((resolve, reject) => {
//     try {
//       client.listObjectsV2(
//         { Bucket: 'ansel', Delimiter: '/' },
//         (err: AWSError, data: S3.ListObjectsV2Output) => {
//           if (err) reject(err)
//           else {
//             const parents: string[] = []

//             data?.CommonPrefixes?.forEach(({ Prefix }: S3.CommonPrefix) =>
//               parents.push(Prefix || '')
//             )

//             resolve(parents.filter(p => p !== ''))
//           }
//         }
//       )
//     } catch (err) {
//       reject(err)
//     }
//   })
// }

// async function getBucketChildren(
//   Prefix: string
// ): Promise<S3.ListObjectsV2Output> {
//   return new Promise((resolve, reject) => {
//     try {
//       client.listObjectsV2(
//         { Bucket: 'ansel', Prefix },
//         (err: AWSError, data: S3.ListObjectsV2Output) => {
//           if (err) reject(err)
//           else resolve(data)
//         }
//       )
//     } catch (err) {
//       reject(err)
//     }
//   })
// }

// getBucketParents()
//   .then(res => {
//     // const formatted = formatBucketChildrenResponse(res)
//     console.log(res)
//     logger.success('Execution complete!')
//   })
//   .catch(err => {
//     logger.error('Error caught from getBucketChildren...')
//     logger.error(err)
//   })

// getBucketChildren('alcha')
//   .then(items => {
//     const formattedItems = formatBucketChildrenResponse(items)
//     console.log(formattedItems)
//     logger.success('Execution complete!')
//   })
//   .catch(err => {
//     logger.error('Error caught from getBucketChildren...')
//     logger.error(err)
//   })
