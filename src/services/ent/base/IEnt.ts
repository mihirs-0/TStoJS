import { ObjectId } from 'mongodb';

/**
 * Base entity fields--should be
 * extended by all entities.
 */
export interface IEnt {
  _id: ObjectId;
  created_date: Date;
}
