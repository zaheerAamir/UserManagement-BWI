import { Request, Response, NextFunction } from "express";
import { ErrorUser, LoginUserDTO, UserDTO } from "../../schema/user.schema.js";

function isEmail(email: string) {

    const pattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    return pattern.test(email)
}

export function createUserMiddleware(req: Request, res: Response, next: NextFunction) {

    try {
        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }
        const body: UserDTO = req.body

        if (!body || !body.email || !body.password || !body.name) {
            error.message = "Please Enter the required details!🛑"

            res.status(error.statusCode).json({
                statusCode: error.statusCode,
                statusText: error.statusText,
                message: error.message
            })

        } else if (!isEmail(body.email)) {
            error.message = "Invalid Email!🛑"

            res.status(error.statusCode).json({
                statusCode: error.statusCode,
                statusText: error.statusText,
                message: error.message
            })

        } else if (body.password.length < 5) {
            console.log(body.password.length)
            error.message = "Invalid Password! Password must be atleast 5 characters long"

            res.status(error.statusCode).json({
                statusCode: error.statusCode,
                statusText: error.statusText,
                message: error.message
            })
        }
        else {
            next()

        }

    } catch (error) {
        console.error("[User Middleware]", error)

    }
}

export function loginInUserMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }

        let body: LoginUserDTO = req.body

        if (!body || !body.email || !body.password) {

            error.message = "Please Enter the required details!🛑"

            res.status(error.statusCode).json({
                statusCode: error.statusCode,
                statusText: error.statusText,
                message: error.message
            })


            
        } else {
           next() 
        }


    } catch (error) {

        console.error("[User Middleware]", error)
    }

}