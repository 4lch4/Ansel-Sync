import { UtilBase } from './UtilBase'

export class RedisUtil extends UtilBase {
  /**
   * Converts the given string array into an object where each value in the
   * given array is mapped to the index number as it's key in the object.
   *
   * For example: `[ 'a', 'b', 'c' ]`
   *
   * Would become: `{ 0: 'a', 1: 'b', 2: 'c' }`
   *
   * @param input An array of strings to be converted into an object.
   * @returns An object containing the values from the input array.
   */
  convertValuesToObject(input: string[]) {
    const returnObj: { [key: string]: string } = {}

    for (let i = 0; i < input.length; i++) returnObj[i] = input[i]

    return returnObj
  }

  /**
   * Attempts to perform an hvals operation on the redis database using the
   * provided key to return all the values within said key.
   *
   * @param key The key to get the values from.
   * @returns An array of strings containing the values from the key hash.
   */
  async getValues(key: string) {
    try {
      return this.red.hvals(key)
    } catch (error) {
      return { error }
    }
  }

  /**
   * Attempts to perform an hmset operation on the redis database using the
   * provided key and values. The values are converted into an object before
   * being sent to the DB using the convertValuesToObject function within this
   * class.
   *
   * @param key The folder/key to set the values in.
   * @param values An array of strings to be set in the key hash.
   * @returns The response from the redis server.
   */
  async setValues(key: string, values: string[]) {
    try {
      return this.red.hmset(key, this.convertValuesToObject(values))
    } catch (error) {
      return { error }
    }
  }
}
