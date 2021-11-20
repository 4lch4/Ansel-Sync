/**
 * An interface that defines the configuration object of the application which
 * contains the necessary properties for the application to properly work.
 */
export interface IAppConfig {
  /**
   * The config object which contains the necessary properties for connecting to
   * the DigitalOcean Space for Ansel, as well as the properties needed for
   * managing the responses from said Space.
   */
  spaces: ISpacesConfig

  /** The connection string for connecting to AICRED00, the Redis DB. */
  redis: string

  /** The beginning of the URL for all images stored in the Ansel Space. */
  imagesBaseUrl: string
}

/**
 * An interface that defines the configuration object which contains the
 * properties necessary for connecting to the DigitalOcean Spaces API.
 */
export interface ISpacesConfig {
  /**
   * The URL for connecting to the Ansel Space which contains the region where
   * it is located:
   *
   * `<region>.digitaloceanspaces.com` = `nyc3.digitaloceanspaces.com`
   */
  endpoint: string

  /** The name of the bucket where the images are stored. */
  bucketName: string

  /** The character used for separating the images into folders. */
  delimeter: string

  /** The ID of the secret key used to access the Spaces API. */
  accessKeyId: string

  /** The value of the secret key used to access the Spaces API. */
  secretAccessKey: string
}
