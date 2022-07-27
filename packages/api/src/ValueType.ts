// Future dev, keep this in sync
export type ValueType = boolean|number|string;

export function isValueType( maybeValueType: unknown): maybeValueType is ValueType {
  return ['boolean', 'number', 'string'].includes(typeof maybeValueType );
}