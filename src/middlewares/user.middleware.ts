import { Request, Response, NextFunction } from "express";
import userSchema, { ErrorUser, LoginUserDTO, UserDTO } from "../../schema/user.schema.js";
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


export function JWTTokenVerify(req: Request, res: Response, next: NextFunction) {

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

                                console.log("[User Middleware] Token is Valid!");

                                (req as any).userID = user.userid; // Add userID directly to the request object

                                next()

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

export function updateAccountNameMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }

        const body = req.body
        if (!body) {
            error.message = "Please Enter the User name!"
            res.status(error.statusCode).json(error)
        } else {
            const userID = (req as any).userID;
            console.log("[User Middleware]", userID)

            next()
        }



    } catch (error) {

        console.error(error)
    }

}



export async function updateUserNameMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }

        const body = req.body
        if (!body || !body.userid || !body.name) {
            error.message = "Please Enter the required details such as userid of the user and user name of the user!"
            res.status(error.statusCode).json(error)
        } else {
            const userID = (req as any).userID;
            console.log("[User Middleware]", "Admin ID:", userID)
            const user = await userSchema.findById({ _id: userID })

            if (user != null) {
                if (user.role == "Admin") {
                    (req as any).userID = userID // Add userID directly to the request object

                    next()


                } else {
                    error.statusCode = 401
                    error.statusText = "Unauthorized!"
                    error.message = "Admin Protected route!"
                    res.status(error.statusCode).json(error)

                }

            } else {
                error.statusCode = 404
                error.statusText = "Not Found!"
                error.message = "Admin Does not exist!"
                res.status(error.statusCode).json(error)

            }


        }



    } catch (error) {

        console.error(error)
    }

}

export function imageUploadMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }

        const body = req.file?.fieldname
        if (!body && body != undefined && body != "ProfileImage") {
            error.message = "Please Enter your profile image as [name: ProfileImage    value: <Image.png/jpg/jpeg>]"
            res.status(error.statusCode).json(error)
        } else {
            const userID = (req as any).userID;
            console.log("[User Middleware]", userID)


            next()
        }




    } catch (error) {
        console.error(error)

    }

}


export async function imageUpdateAdminMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }

        const body = req.file?.fieldname
        if (!body && body != undefined && body != "ProfileImage") {
            error.message = "Please Enter your profile image as [name: ProfileImage    value: <Image.png/jpg/jpeg>]"
            res.status(error.statusCode).json(error)
        } else {
            const userID = (req as any).userID;
            console.log("[User Middleware]", "Admin ID:", userID)


            const user = await userSchema.findById({ _id: userID })

            if (user != null) {
                if (user.role == "Admin") {
                    (req as any).userID = userID // Add userID directly to the request object
                    console.log("[Uer middleware]", req.body.userid)
                    next()

                } else {
                    error.statusCode = 401
                    error.statusText = "Unauthorized!"
                    error.message = "Admin Protected route!"
                    res.status(error.statusCode).json(error)

                }

            } else {
                error.statusCode = 404
                error.statusText = "Not Found!"
                error.message = "Admin Does not exist!"
                res.status(error.statusCode).json(error)

            }



        }




    } catch (error) {
        console.error(error)

    }

}

export async function deleteUserMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        let error: ErrorUser = {
            statusCode: 400,
            statusText: "Bad Request",
            message: ""
        }

        const body = req.body
        if (!body || !body.userid) {
            error.message = "Please Enter the required details such as userid of the user and user name of the user!"
            res.status(error.statusCode).json(error)
        } else {
            const userID = (req as any).userID;
            console.log("[User Middleware]", "Admin ID:",userID)
            const user = await userSchema.findById({ _id: userID })

            if (user != null) {
                if (user.role == "Admin") {
                    (req as any).userID = userID // Add userID directly to the request object

                    next()


                } else {
                    error.statusCode = 401
                    error.statusText = "Unauthorized!"
                    error.message = "Admin Protected route!"
                    res.status(error.statusCode).json(error)

                }

            } else {
                error.statusCode = 404
                error.statusText = "Not Found!"
                error.message = "Admin Does not exist!"
                res.status(error.statusCode).json(error)

            }


        }



    } catch (error) {

        console.error(error)
    }

}