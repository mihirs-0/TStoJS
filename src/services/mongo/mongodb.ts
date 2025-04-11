import { MongoClient, MongoClientOptions } from 'mongodb';

const mongodbUri = process.env.CUSTOMCONNSTR_MONGODB_URI;
const nodeEnv = process.env.NODE_ENV;

let client: MongoClient;
let connectToMongoClientPromise: Promise<MongoClient>;

if (nodeEnv === 'development') {
  // In development, use a mock connection
  console.log('Using mock MongoDB connection in development mode');
  connectToMongoClientPromise = Promise.resolve({} as MongoClient);
} else if (nodeEnv === 'test') {
  // In test mode, use a global variable so that we can override it in jest-setup
  const globalWithMongo = global as typeof globalThis & {
    _mongoTestClientPromise?: Promise<MongoClient>;
  };
  if (globalWithMongo._mongoTestClientPromise == null) {
    throw new Error('Mongo Memory Server is not running.');
  }
  connectToMongoClientPromise = globalWithMongo._mongoTestClientPromise;
} else {
  // In production, use the actual MongoDB connection
  if (typeof mongodbUri !== 'string') {
    throw new Error('Missing environment variable: "CUSTOMCONNSTR_MONGODB_URI"');
  }
  const options: MongoClientOptions = {};
  client = new MongoClient(mongodbUri, options);
  connectToMongoClientPromise = client.connect();
}

export const getMongoClient = async (): Promise<MongoClient> => {
  return connectToMongoClientPromise;
};

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default connectToMongoClientPromise;
