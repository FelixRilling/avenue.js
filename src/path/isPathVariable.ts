/**
 * Checks if the pathPart is a path variable.
 *
 * @private
 * @param {string} pathPart path string.
 * @returns {boolean} if the pathPart is a path variable.
 */
const isPathVariable = (pathPart: string): boolean => pathPart[0] === ":";

export { isPathVariable };