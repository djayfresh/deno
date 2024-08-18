import { userId } from "./id.model.ts";
export type { userId } from "./id.model.ts";

export interface User {
    _id?: userId;
    username: string;
    profile: { [key: string]: string | number | object };
}