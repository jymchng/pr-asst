import { KeyValueObject } from './types';
export declare function parseKeyValueFileIntoConfiguration<
  AnyObjType extends KeyValueObject,
>(filePath: string): AnyObjType;
export declare const interpolateValue: <AnyObjType extends KeyValueObject>(
  value: string,
  keyValueObject: AnyObjType,
) => string;
export declare const castValue: (value: string) => string | number;
export declare function parseKeyValueLinesIntoConfiguration<
  AnyObjType extends KeyValueObject,
>(fileContents: string): AnyObjType;
