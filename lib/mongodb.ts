import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!process.env.MONGODB_URI) {
  throw new Error("❌ MONGODB_URI n'est pas défini dans .env.local");
}

if (!process.env.MONGODB_DB) {
  throw new Error("❌ MONGODB_DB n'est pas défini dans .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// 🔌 Objet mongo regroupant client et connectToDb
export const mongo = {
  clientPromise,
  async connectToDb(): Promise<Db> {
    const client = await clientPromise;
    return client.db(dbName);
  },
};

export default mongo;
