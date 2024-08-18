import { Bootstrapped, bootstrap } from "./utility/bootstrap.ts";
import { UserService } from "./services/user.service.ts";
import { userId } from "./models/user.model.ts";

@Bootstrapped()
export class App {
    constructor(private readonly userService: UserService) {
    }

    async start() {
        const user = await this.userService.getById('66c25a665dff1c716cd94e42' as userId); //'fake-id'
        console.log("User:", user);
    }
}

const app = bootstrap(App);

app.start();