export type mongoId = { _mongoId: undefined } & string;
export type userId = mongoId & { _userId: undefined };