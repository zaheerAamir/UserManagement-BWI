import { Request, Response, NextFunction } from "express";
import { ErrorUser, JWTPayload, LoginUserDTO, UserDTO } from "../../schema/user.schema.js";
import jwt from "jsonwebtoken"

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


export function updateAccountMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }

        const authorization = req.headers.authorization
        if (authorization != undefined) {

            const access_token_secret = process.env.ACCESS_TOKEN_SECRET
            const token = authorization.split(" ")
            if (access_token_secret != undefined) {

                jwt.verify(token[1], access_token_secret, (err, user) => {
                    if (err) {

                        error.statusCode = 401
                        error.statusText = "Unauthorized!"
                        error.message = "Invalid Token!"
                        res.status(error.statusCode).json(error)
                    }

                    if (user !== undefined && typeof user !== 'string') {

                        const currentTime = Math.floor(Date.now() / 1000)

                        if (user.exp !== undefined) {
                            if (user.exp < currentTime) {
                                console.log("[User Middleware] Token is expired!")

                                error.statusCode = 401
                                error.statusText = "Unauthorized!"
                                error.message = "Token Expired!"
                                res.status(error.statusCode).json(error)
                            } else {
                                console.log("[User Middleware] Token is Valid!")

                                const body = req.body
                                if (!body) {
                                    error.message = "Please Enter the User name!"
                                    res.status(error.statusCode).json(error)
                                } else {
                                    (req as any).userID = user.userid; // Add userID directly to the request object

                                    next()
                                }

                            }
                        } else {
                            error.statusCode = 500
                            error.statusText = "Internal server Error!"
                            error.message = "Cannot extract token expiry time!"
                            res.status(error.statusCode).json(error)
                        }

                    }

                })
            } else {
                console.log("[User Middleware] Access Token secret not provided!")
            }



        } else {
            error.statusCode = 401
            error.statusText = "Unauthorized!"
            error.message = "Please enter the accessToken given to you in this form: Bearer <access_token>"
            res.status(error.statusCode).json(error)
        }




    } catch (error) {
        console.error(error)

    }

}


export function updateUserMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }

        const authorization = req.headers.authorization
        if (authorization != undefined) {

            const access_token_secret = process.env.ACCESS_TOKEN_SECRET
            const token = authorization.split(" ")
            if (access_token_secret != undefined) {

                jwt.verify(token[1], access_token_secret, (err, user) => {
                    if (err) {

                        error.statusCode = 401
                        error.statusText = "Unauthorized!"
                        error.message = "Invalid Token!"
                        res.status(error.statusCode).json(error)
                    }

                    if (user !== undefined && typeof user !== 'string') {

                        const currentTime = Math.floor(Date.now() / 1000)

                        if (user.exp !== undefined) {
                            if (user.exp < currentTime) {
                                console.log("[User Middleware] Token is expired!")

                                error.statusCode = 401
                                error.statusText = "Unauthorized!"
                                error.message = "Token Expired!"
                                res.status(error.statusCode).json(error)
                            } else {
                                console.log("[User Middleware] Token is Valid!")

                                const body = req.body
                                if (!body && !body.userid && !body.name) {
                                    error.message = "Please Enter the User name!"
                                    res.status(error.statusCode).json(error)
                                } else {
                                    (req as any).userID = user.userid; // Add userID directly to the request object

                                    next()
                                }

                            }
                        } else {
                            error.statusCode = 500
                            error.statusText = "Internal server Error!"
                            error.message = "Cannot extract token expiry time!"
                            res.status(error.statusCode).json(error)
                        }

                    }

                })
            } else {
                console.log("[User Middleware] Access Token secret not provided!")
            }



        } else {
            error.statusCode = 401
            error.statusText = "Unauthorized!"
            error.message = "Please enter the accessToken given to you in this form: Bearer <access_token>"
            res.status(error.statusCode).json(error)
        }




    } catch (error) {
        console.error(error)

    }

}
