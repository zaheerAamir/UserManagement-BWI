import { Express } from "express";
import { updateAccountHandler, createUserHandler, healthCheck, loginUserHandler, refreshAccessTokenHandler, logoutHandler, deleteUserHandler, createAdminHandler, updateUserHandler } from "./handlers/user.handler.js";
import { updateAccountMiddleware, createUserMiddleware, loginInUserMiddleware, updateUserMiddleware } from "./middlewares/user.middleware.js";

function routes(app: Express) {
    app.get("/healthCheck", healthCheck)

    app.post("/createUser", createUserMiddleware, createUserHandler)
    app.post("/createAdmin", createUserMiddleware, createAdminHandler)

    app.post("/login", loginInUserMiddleware, loginUserHandler)
    app.delete("/logout", updateAccountMiddleware, logoutHandler)

    app.put("/updateAccount", updateAccountMiddleware, updateAccountHandler) 
    app.put("/updateUser", updateUserMiddleware, updateUserHandler)
    
    app.put("/token", refreshAccessTokenHandler)

    app.delete("/deleteUser", updateAccountMiddleware, deleteUserHandler)
}

export default routes