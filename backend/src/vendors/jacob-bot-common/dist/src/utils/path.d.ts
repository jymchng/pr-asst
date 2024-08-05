/**
 * Finds the directory containing the package.json file.
 *
 * @param startDir - The directory to start the search from (default is the current working directory).
 * @returns The path to the directory containing package.json or undefined if not found.
 */
export declare function findPackageJsonDir(
  startDir?: string,
): string | undefined;
/**
 * Finds the directory containing a specified marker file.
 *
 * @param startDir - The directory to start the search from (default is the current working directory).
 * @param toLookForFileName - The name of the marker file to search for.
 * @returns The path to the directory containing the marker file or undefined if not found.
 */
export declare function findFileDir(
  startDir: string | undefined,
  toLookForFileName: string,
): string | undefined;
/**
 * Joins paths relative to the directory containing package.json.
 *
 * @param paths - The paths to join.
 * @returns The joined path.
 */
export declare function joinRelativeToPackageJson(...paths: string[]): string;
/**
 * Joins paths relative to a specified directory.
 *
 * @param dir - The base directory to join paths relative to (e.g., the directory containing package.json).
 * @param paths - The paths to join.
 * @returns The joined path.
 * @throws Error if the specified directory or the joined path does not exist.
 */
export declare function joinRelativePaths(
  dir: string,
  ...paths: string[]
): string;
