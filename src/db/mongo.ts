// Import the latest major version of the MongoDB driver
import { Db, MongoClient, ObjectId } from "../utility/mongodb.ts";
import { env } from "../env/environment.ts";

export class DBContext {
    static db: Db | null;
    private static CLIENT: MongoClient;

    static isConnected() {
        return !!this.db;
    }

    static async open() {
        if (this.isConnected()) {
            return this.db;
        }

        const passwordKey = '{password}';
        const replaceUrl = `mongodb://${env.DB_USER}:${passwordKey}@${env.DB_HOST}:${env.DB_PORT}`;

        // Configure a MongoDB client
        const url = replaceUrl.replace(passwordKey, env.DB_PASS);
        this.CLIENT = new MongoClient(url);
        
        // Connect to a MongoDB instance
        await this.CLIENT.connect();
        console.log("Connected successfully to server");
        console.log(`  ${replaceUrl}`);
        
        // Get a reference to a database
        this.db = this.CLIENT.db(env.DB_NAME);
    }

    static async close() {
        this.db = null;
        await this.CLIENT.close();
    }

    static async getCollection(name: string) {
        if (!this.isConnected()) {
            await this.open();
        }

        const collection = this.db?.collection(name);
        console.log("Loaded Collection:", name);
        return collection;
    }

    static toId(id: string) {
        try {
            return new ObjectId(id);
        }
        catch {
            throw new Error(`"${id}" is not a valid MongoId`);
        }
    }
}
