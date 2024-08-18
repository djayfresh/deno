import { Injectable } from "../../utility/bootstrap.ts";
import { BaseRepository } from "../base.repository.ts";
import { User } from "../../models/user.model.ts";

@Injectable()
export class UserRepository extends BaseRepository<User> {
    constructor() {
        super('user');
    }
}