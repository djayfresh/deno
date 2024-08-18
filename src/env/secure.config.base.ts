export interface IEnvironment {
    Environment: Environments;
    MongoDB: MongoDBConfig;
}

export enum Environments {
    local = 'local'
}

export type SecureConfig = {
    [key in Environments]: {
        MongoDB: SecureMongoDBConfig;
    }
}

export interface SecureMongoDBConfig {
    username: string;
    password: string;
}

export interface MongoDBConfig extends SecureMongoDBConfig {
    ip: string;
    db: string;
};

export class BaseSecureConfig implements SecureConfig {
    local = { 
        MongoDB: { username: "", password: "" } 
    };
}
