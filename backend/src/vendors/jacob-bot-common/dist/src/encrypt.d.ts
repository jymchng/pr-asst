/// <reference types="node" />
import { Secret } from './secret';
export type Encrypted<T extends unknown> = {
  readonly __opaque_type: T;
};
export declare class EncryptionService {
  #private;
  encoding: BufferEncoding;
  constructor(secretKey: Secret<string>);
  encryptString(textToEncrypt: string): Encrypted<string>;
  decryptString(encryptedText: Encrypted<string>): string;
}
