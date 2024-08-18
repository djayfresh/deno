import { Document } from "../utility/mongodb.ts";
import { userId } from "../models/user.model.ts";
import { mongoId } from "./id.model.ts";

export type DBModel<T extends Document> = T & {
    _id: mongoId;
    _ts: number;
    _u: userId;
};

export enum AuditAction {
    Delete = 'delete',
    Update = 'update'
}

export type DBAuditModel<T extends object> = DBModel<T> & {
    _og_id: mongoId;
    _action: AuditAction;
    _tsu: number;
    _uu: userId;
};