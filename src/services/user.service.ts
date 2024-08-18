import { Injectable } from "../utility/bootstrap.ts";
import { userId } from "../models/user.model.ts";
import { UserRepository } from "../db/repositories/user.repository.ts";

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {
    }

    getById(userId: userId) {
        return this.userRepository.getById(userId);
    }
}