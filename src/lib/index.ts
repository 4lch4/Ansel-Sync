import { S3 } from 'aws-sdk'

export * from './AppConfig'
export * from './utils'

/**
 * Verifies the given `data` object contains the provided property names. If
 * any are missing, the name of the property is added to an array which is
 * returned at the end. If no properties are missing, then `true` is returned.
 *
 * @param data The object to be validated.
 * @param propertyNames The names of the properties that need to be present.
 *
 * @returns `true` or a string array of missing property names.
 */
export function validateProperties(
  data: S3.ListObjectsV2Output,
  propertyNames: string[]
): boolean | string[] {
  const missingProperties = []

  for (const propertyName of propertyNames) {
    if (Object.keys(data).includes(propertyName)) {
      missingProperties.push(propertyName)
    }
  }

  return missingProperties.length === 0 ? true : missingProperties
}
