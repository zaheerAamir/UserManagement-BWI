import { Express } from "express";
import { createUserHandler, healthCheck, loginUserHandler } from "./handlers/user.handler.js";
import { createUserMiddleware } from "./middlwares/user.middleware.js";

function routes(app: Express) {
    app.get("/healthCheck", healthCheck)
    app.post("/createUser", createUserMiddleware, createUserHandler)
    app.post("/loginUser", loginUserHandler) 
}

export default routes