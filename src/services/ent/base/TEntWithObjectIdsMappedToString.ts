import { IEnt } from '@/services/ent/base/IEnt';
import { ObjectId } from 'mongodb';

// Base transformation: ObjectId -> string
type TransformObjectId<T> = T extends ObjectId
  ? string
  : T extends Date
    ? Date // date is ok
    : T extends Array<infer U>
      ? Array<TransformObjectId<U>>
      : T extends object
        ? TransformObjectIdNested<T>
        : T;

// Recursive type to handle nested objects
export type TransformObjectIdNested<T> = {
  [K in keyof T]: TransformObjectId<T[K]>;
};

/**
 * Enforce that ObjectIDs are converted to strings for NextJS client
 * at three different levels:
 * - root field
 * - nested object field
 * - nested object array field
 */
export type TEntWithObjectIdsMappedToString<EntModelType extends IEnt> =
  TransformObjectIdNested<EntModelType>;
