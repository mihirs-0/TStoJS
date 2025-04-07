import connectToMongoClientPromise from '@/services/mongo/mongodb';
import { Collection, Db, Document, MongoClient } from 'mongodb';
import { EEntCollectionName } from '../EEntCollectionName';

const DB_NAME = 'scout-ai';

export abstract class DbEntService {
  public static async genClient(): Promise<MongoClient> {
    const mongoClient = await connectToMongoClientPromise;
    if (mongoClient == null) {
      throw new Error('Scout MongoDB client is not connected');
    }
    return mongoClient;
  }

  public static async genDb(): Promise<Db> {
    const client = await this.genClient();
    return client.db(DB_NAME);
  }

  public static async genCollection<
    CollectionModelType extends Document = Document,
  >(
    collectionName: EEntCollectionName
  ): Promise<Collection<CollectionModelType>> {
    const client = await this.genClient();
    return client.db(DB_NAME).collection(collectionName);
  }
}
