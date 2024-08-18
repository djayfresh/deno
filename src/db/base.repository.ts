import { BulkWriteOptions, Collection, Document, Filter, FindOptions, OptionalUnlessRequiredId, UpdateFilter, UpdateOptions } from "../utility/mongodb.ts";
import { DBContext } from "./mongo.ts";
import { userId } from "../models/user.model.ts";
import { DBModel } from "../models/db.model.ts";
import { mongoId } from "../models/id.model.ts";

export abstract class BaseRepository<T extends Document> {
    protected _collection: Collection<T> | undefined;
    //protected _collectionAudit: Collection<T & DBAuditModel> | undefined;

    constructor(private collectionName: string) {
        this.open();
    }

    protected async open() {
        if (!this._collection) {
            await DBContext.getCollection(this.collectionName).then(collection => {
                this._collection = collection;
            });
        }
    }

    protected async collection(): Promise<Collection<T>> {
        await this.open();
        return this._collection as Collection<T>;
    }
    
    getById(id: mongoId) {
        return this.findOne({ _id: DBContext.toId(id) });
    }
    
    getByIds(ids: mongoId[]) {
        return this.findOne({ _id: { $in: ids.map(id => DBContext.toId(id)) } });
    }

    async find(query: Filter<T>, options?: FindOptions): Promise<DBModel<T>[]> {
        const cursor = (await this.collection()).find(query, options);
        const results = await cursor.toArray();
        return results.map(result => {
            return this.map(result) as DBModel<T>;
        });
    }

    async findOne(query: Filter<T>, options?: FindOptions): Promise<DBModel<T> | undefined> {
        return (await this.collection()).findOne(query, options).then(result => {
            return this.map(result);
        });
    }

    async insert(data: T, auditUserId: userId, options?: UpdateOptions) {
        const insert: OptionalUnlessRequiredId<T> = {
            ...data,
            _u: auditUserId,
            _ts: Date.now()
        };

        return (await this.collection()).insertOne(insert, options).then(result => {
            insert._id = result.insertedId.toString();
            return this.map(insert);
        });
    }

    async insertMany(data: T[], auditUserId: userId, options?: BulkWriteOptions): Promise<DBModel<T>[]> {
        const insert: OptionalUnlessRequiredId<T>[] = data.map(item => { 
            return {
                ...item,
                _u: auditUserId,
                _ts: Date.now()
            } 
        });

        return (await this.collection()).insertMany(insert, options).then(results => {
            return insert.map((raw, index) => {
                raw._id = results.insertedIds[index];
                return this.map(raw) as DBModel<T>;
            });
        });
    }

    async updateOne(query: Filter<T>, data: T, auditUserId: userId, options?: UpdateOptions) {
        const update: UpdateFilter<T> = {
            $set: {
                ...data,
                _uu: auditUserId,
                _tsu: Date.now()
            }
        };

        return (await this.collection()).updateOne(query, update, options).then(() => {
            return this.findOne(query);
        });
    }

    async updateMany(query: Filter<T>, data: T, auditUserId: userId, options?: UpdateOptions) {
        const update: UpdateFilter<T> = {
            $set: {
                ...data,
                _uu: auditUserId,
                _tsu: Date.now()
            }
        };

        return (await this.collection()).updateMany(query, update, options).then(() => {
            return this.find(query)
        });
    }

    protected map(baseDocument: T | null) : DBModel<T> | undefined {
        return baseDocument? {
            ...baseDocument,
            _id: baseDocument?._id.toString() as mongoId,
        } : undefined;
    }
}