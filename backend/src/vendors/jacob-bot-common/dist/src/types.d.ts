export type ConvertValueTypesOfMappedTypeToSpecifiedType<
  MappedType,
  SpecifiedType,
> = {
  [K in keyof MappedType]?: SpecifiedType;
};
export type KeyValueObject = {
  [key: string]: unknown;
};
