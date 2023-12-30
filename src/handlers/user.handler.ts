import { Response, Request } from "express";
import { createUserService, loginUserService } from "../../services/user.srvice.js";
import { ErrorUser, LoginUserDTO, User, UserDTO } from "../../schema/user.schema.js";
import bcrypt from "bcrypt";

export async function healthCheck(req: Request, res: Response) {
    const json = {
        "Foo": "barr"
    }
    console.log("Server is Healthy!!")
    res.send(json)
}

export async function createUserHandler(req: Request, res: Response) {

    const body: UserDTO = req.body
    console.log("[User Handler]", body)

    const created = createUserService(body)
    if (await created) {

        res.status(201).json({
            Message: "User created successfully!"
        })
    } else {
        const error: ErrorUser = {
            statusCode: 500,
            statusText: "Internal server error",
            message: "Internal server error"
        }
        res.status(error.statusCode).json(error)

    }
}

export async function loginUserHandler(req: Request, res: Response) {

    const body: LoginUserDTO = req.body
    console.log("[User Handler]", body)

    const loggedIn = await loginUserService(body)
    
    if (loggedIn != undefined) {
      if (loggedIn.status == true) {
        res.status(200).json({
            Message: "User Logged In successfully!"
        })
        
      } else {
        const error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: loggedIn.message
        }
        res.status(error.statusCode).json(error)
        
      }  
    }
}