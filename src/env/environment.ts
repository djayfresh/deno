import "jsr:@std/dotenv@^0.225.0/load";

export const loadEnv = Deno.env.toObject();
// console.log("loaded:", loadEnv);

export const env = {
    DB_HOST: loadEnv.DB_HOST,
    DB_NAME: loadEnv.DB_NAME,
    DB_USER: loadEnv.DB_USER,
    DB_PASS: loadEnv.DB_PASS
};
// console.log("env:", env);