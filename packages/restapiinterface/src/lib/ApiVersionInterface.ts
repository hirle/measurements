export interface ApiVersionInterface {
  version: string,
  major: number,
  minor: number,
  patch: number,
  opt?: string
}

export function narrowApiVersionInterface( input: unknown ): ApiVersionInterface {
  if (typeof input === 'object'
    && input !== null
    && 'version' in input
    && typeof (input as {version: unknown}).version === 'string'
    && 'major' in input
    && typeof (input as {major: unknown}).major === 'number'
    && 'minor' in input
    && typeof (input as {minor: unknown}).minor === 'number'
    && 'patch' in input
    && typeof (input as {patch: unknown}).patch === 'number') {
    return input as ApiVersionInterface;
  } else {
    throw new Error('unexpected data')
  } 
} 