import { BaseEnt } from '../base/BaseEnt';
import { TransformObjectIdNested } from '../base/TEntWithObjectIdsMappedToString';
import { EEntCollectionName } from '../EEntCollectionName';
import { IEntEzRecord } from './IEntEzRecord';

/**
 * Sample entity for demo purposes
 */
export class EntEzRecord extends BaseEnt<IEntEzRecord> {
  public static COLLECTION_NAME = EEntCollectionName.EntEzRecord;

  public getModelWithStringIds(): TransformObjectIdNested<IEntEzRecord> {
    return {
      ...this.model,
      _id: this.model._id.toString(),
    };
  }
}
