import { MongoClient, MongoClientOptions } from 'mongodb';

const mongodbUri = process.env.CUSTOMCONNSTR_MONGODB_URI;
if (typeof mongodbUri !== 'string') {
  throw new Error('Missing environment variable: "CUSTOMCONNSTR_MONGODB_URI"');
}

const options: MongoClientOptions = {};

let client: MongoClient;
let connectToMongoClientPromise: Promise<MongoClient>;

const nodeEnv = process.env.NODE_ENV;
if (nodeEnv === 'test') {
  // In test mode, use a global variable so that we can override it in jest-setup
  const globalWithMongo = global as typeof globalThis & {
    _mongoTestClientPromise?: Promise<MongoClient>;
  };
  if (globalWithMongo._mongoTestClientPromise == null) {
    throw new Error('Mongo Memory Server is not running.');
  }
  connectToMongoClientPromise = globalWithMongo._mongoTestClientPromise;
} else if (nodeEnv === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (globalWithMongo._mongoClientPromise == null) {
    client = new MongoClient(mongodbUri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  connectToMongoClientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(mongodbUri, options);
  connectToMongoClientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default connectToMongoClientPromise;
