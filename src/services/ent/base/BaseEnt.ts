import {
  ClientSession,
  Collection,
  Document,
  Filter,
  FindOptions,
  ObjectId,
  PushOperator,
  Sort,
  UpdateFilter,
  UpdateResult,
} from 'mongodb';
import { EEntCollectionName } from '../EEntCollectionName';
import { DbEntService } from './DbEntService';
import { IEnt } from './IEnt';
import { TEntWithObjectIdsMappedToString } from './TEntWithObjectIdsMappedToString';

/** Minimum context to generalize Ent functionality */
export interface IEntClass<Model extends IEnt, T extends BaseEnt<Model>> {
  new (collection: Collection, model: Model): T;
  COLLECTION_NAME: EEntCollectionName;
  genNullable<Model extends IEnt, T extends BaseEnt<Model>>(
    id: string
  ): Promise<T | null>;
  genQueryMany<Model extends IEnt, T extends BaseEnt<Model>>(
    query: Filter<Model>
  ): Promise<T[]>;
  genQueryOne<Model extends IEnt, T extends BaseEnt<Model>>(
    query: Filter<Model>
  ): Promise<T | null>;
}

export abstract class BaseEnt<Model extends IEnt> {
  constructor(
    protected collection: Collection,
    protected model: Model
  ) {}
  /** Parse object ids to handle safely via NextJS SSR. */
  public abstract getModelWithStringIds(): TEntWithObjectIdsMappedToString<Model>;

  public static COLLECTION_NAME: EEntCollectionName;

  public static async genNullable<Model extends IEnt, T extends BaseEnt<Model>>(
    this: IEntClass<Model, T>,
    id: string
  ): Promise<T | null> {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const model = await collection.findOne<Model>({
      _id: ObjectId.createFromHexString(id),
    });
    if (model == null) {
      return null;
    }
    return new this(collection, model);
  }

  public static async genEnforce<Model extends IEnt, T extends BaseEnt<Model>>(
    this: IEntClass<Model, T>,
    id: string
  ): Promise<T> {
    const ent = await this.genNullable<Model, T>(id);
    if (ent == null) {
      throw new Error('Ent not found. Id=' + id);
    }
    return ent;
  }

  public static async genOne<Model extends IEnt, T extends BaseEnt<Model>>(
    this: IEntClass<Model, T>
  ): Promise<T | null> {
    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const model = await collection.findOne<Model>();
    if (model == null) {
      return null;
    }
    return new this(collection, model);
  }

  public static async genQueryMany<
    Model extends IEnt,
    T extends BaseEnt<Model>,
  >(
    this: IEntClass<Model, T>,
    query: Filter<Model>,
    sort: Sort = {},
    limit: number = 0
  ): Promise<T[]> {
    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const queryConfig = collection
      .find<Model>(query as Filter<Document>)
      .sort(sort);
    if (limit > 0) {
      queryConfig.limit(limit);
    }

    const models = await queryConfig.toArray();
    return models.map((model) => new this(collection, model));
  }

  /**
   * Use this method if you are returning the original source entity.
   *
   * If you are returning a transformed entity, query the collection directly
   * via `DbEntService.genCollection` and transform the result.
   */
  public static async genAggregate<
    Model extends IEnt,
    T extends BaseEnt<Model>,
  >(this: IEntClass<Model, T>, aggregationPipeline: Document[]): Promise<T[]> {
    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const models = await collection
      .aggregate<Model>(aggregationPipeline)
      .toArray();
    return models.map((model) => new this(collection, model));
  }

  public static async genCount<Model extends IEnt, T extends BaseEnt<Model>>(
    this: IEntClass<Model, T>,
    query: Filter<Model> = {}
  ): Promise<number> {
    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const count = await collection.countDocuments(query as Filter<Document>);
    return count;
  }

  public static async genQueryOne<Model extends IEnt, T extends BaseEnt<Model>>(
    this: IEntClass<Model, T>,
    query: Filter<Model>,
    options?: FindOptions
  ): Promise<T | null> {
    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const model = await collection.findOne<Model>(
      query as Filter<Document>,
      options
    );
    if (model == null) {
      return null;
    }
    return new this(collection, model);
  }

  public static async genCreateOne<
    Model extends IEnt,
    T extends BaseEnt<Model>,
  >(
    this: IEntClass<Model, T>,
    fields: Model,
    session?: ClientSession
  ): Promise<ObjectId> {
    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const creationOp = await collection.insertOne(fields, { session });
    if (!creationOp.acknowledged) {
      throw new Error('Creation op not acknowledged');
    }
    return creationOp.insertedId;
  }

  public static async genUpdateOne<
    Model extends IEnt,
    T extends BaseEnt<Model>,
  >(
    this: IEntClass<Model, T>,
    id: string,
    fieldsForSet: Partial<Model>,
    fieldsForPush?: PushOperator<Model>,
    session?: ClientSession
  ): Promise<T> {
    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const _id = ObjectId.createFromHexString(id);
    let updateFilter: UpdateFilter<Document> = { $set: fieldsForSet };
    if (fieldsForPush != null) {
      updateFilter = { ...updateFilter, $push: fieldsForPush };
    }
    const model = await collection.findOneAndUpdate({ _id }, updateFilter, {
      session,
      returnDocument: 'after',
    });
    if (model == null) {
      throw new Error(
        `Did not successfully update ent ${this.COLLECTION_NAME} with id=${id}`
      );
    }
    return new this(collection, model as Model);
  }

  public static async genUpdateMany<
    Model extends IEnt,
    T extends BaseEnt<Model>,
  >(
    this: IEntClass<Model, T>,
    query: Filter<Model>,
    update: UpdateFilter<Model>,
    session?: ClientSession
  ): Promise<UpdateResult<T>> {
    const collection = await DbEntService.genCollection(this.COLLECTION_NAME);
    const updateResult = await collection.updateMany(
      query as Filter<Document>,
      update as UpdateFilter<Document>,
      {
        session,
      }
    );
    return updateResult;
  }

  public getModel(): Model {
    return this.model;
  }
}
