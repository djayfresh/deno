import { BulkWriteOptions, Collection, Document, Filter, FindCursor, FindOptions, OptionalUnlessRequiredId, UpdateFilter, UpdateOptions, WithId } from "@mongodb";
import { DBContext } from "./mongo.ts";
import { userId } from "../models/user.model.ts";
import { DBModel } from "../models/db.model.ts";

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

    protected async collection() {
        await this.open();
        return this._collection;
    }

    async find(query: Filter<T>, options?: FindOptions): Promise<FindCursor<WithId<DBModel<T>>> | undefined> {
        return (await this.collection())?.find(query, options);
    }

    async findOne(query: Filter<T>, options?: FindOptions): Promise<WithId<DBModel<T>> | undefined> {
        return (await this.collection())?.findOne(query, options);
    }

    async insert(data: T, auditUserId: userId, options?: UpdateOptions) {
        const insert: OptionalUnlessRequiredId<T> = {
            ...data,
            _u: auditUserId,
            _ts: Date.now()
        };

        return (await this.collection())?.insertOne(insert, options);
    }

    async insertMany(data: T[], auditUserId: userId, options?: BulkWriteOptions) {
        const insert: OptionalUnlessRequiredId<T>[] = data.map(item => { return {
            ...item,
            _u: auditUserId,
            _ts: Date.now()
        } });

        return (await this.collection())?.insertMany(insert, options);
    }

    async updateOne(query: Filter<T>, data: T, auditUserId: userId, options?: UpdateOptions) {
        const update: UpdateFilter<T> = {
            $set: {
                ...data,
                _uu: auditUserId,
                _tsu: Date.now()
            }
        };

        return (await this.collection())?.updateOne(query, update, options);
    }

    async updateMany(query: Filter<T>, data: T, auditUserId: userId, options?: UpdateOptions) {
        const update: UpdateFilter<T> = {
            $set: {
                ...data,
                _uu: auditUserId,
                _tsu: Date.now()
            }
        };

        return (await this.collection())?.updateMany(query, update, options);
    }
}