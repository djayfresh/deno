import { Document } from "@mongodb";
import { userId } from "../models/user.model.ts";

export type DBModel<T> = T & Document & {
    _ts: number;
    _u: userId;
};

export enum AuditAction {
    Delete = 'delete',
    Update = 'update'
}

export type DBAuditModel<T> = DBModel<T> & {
    _action: AuditAction;
    _tsu: number;
    _uu: userId;
};