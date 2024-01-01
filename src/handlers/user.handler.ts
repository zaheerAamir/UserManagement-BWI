import { Response, Request } from "express";
import { createAdminService, createJWT, createUserService, deleteUserService, imageUploadService, loginUserService, logoutService, refreshAccessTokenService, updateAccountService, } from "../../services/user.srvice.js";
import userSchema, { ErrorUser, LoginUser, LoginUserDTO, UserDTO } from "../../schema/user.schema.js";
import crypto from "crypto"

export async function healthCheck(req: Request, res: Response) {
    const json = {
        "Foo": "barr"
    }

    //Generating access_token and refresh_token secret
    const length = 32
    console.log(crypto.randomBytes(length).toString('hex'))

    console.log("Server is Healthy!!")
    res.send(json)
}

export async function getAllUsers(req: Request, res: Response) {
    
    const users = await userSchema.find()
    res.json(users)
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

export async function createAdminHandler(req: Request, res: Response) {

    const body: UserDTO = req.body
    console.log("[User Handler]", body)

    const created = createAdminService(body)
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
            const tokens = await createJWT(body.email)

            const response: LoginUser = {
                access_token: tokens.accessToken,
                refresh_token: tokens.refreshToken,
                message: "User Logged In Successfully!"

            }

            res.status(200).json(response)

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

export async function updateAccountHandler(req: Request, res: Response) {

    console.log("aaaaaaaa",req.body.name)
    const userID = (req as any).userID;
    console.log("[User Handler]", userID)

    const check = await updateAccountService(userID, req.body.name)

    if (check != undefined && check) {

        res.json({ Message: "Updated User name successfully!" })
    } else {

        const error: ErrorUser = {
            statusCode: 401,
            statusText: "Unauthorized!",
            message: "Access denied Users cannot access this route!"
        }
        res.status(error.statusCode).json(error)

    }

}

export async function updateUserNameHandler(req: Request, res: Response) {

    console.log("nfjeijufeubfikefuife",req.body.name, req.body.userid)
    const adminID = (req as any).userID;
    console.log("[User Handler]", adminID)

    const check = await updateAccountService(req.body.userid, req.body.name)

    if (check != undefined && check) {

        res.json({ Message: "Updated User name successfully!" })
    } else {

        const error: ErrorUser = {
            statusCode: 404,
            statusText: "Not Found!",
            message: "User Does not exist!"
        }
        res.status(error.statusCode).json(error)

    }



}

export async function refreshAccessTokenHandler(req: Request, res: Response) {

    console.log(req.body.token)
    const token = await refreshAccessTokenService(req.body.token)

    if (token != undefined && token != "") {
        res.json({
            accessToken: token
        })
    } else {
        const error: ErrorUser = {
            statusCode: 401,
            statusText: "Unauthorized",
            message: "Invalid Refresh Token!"
        }
        res.status(error.statusCode).json(error)
    }
}

export async function logoutHandler(req: Request, res: Response) {

    const userID = (req as any).userID;

    const check = await logoutService(userID)

    if (check != undefined && check) {
        res.json({
            Message: "Logged out successfully!"
        })

    } else {
        const error: ErrorUser = {
            statusCode: 500,
            statusText: "Bad Request",
            message: "Internal Server error!"
        }
        res.status(error.statusCode).json(error)

    }


}

export async function deleteUserHandler(req: Request, res: Response) {


    const userID = (req as any).userID;
    const check = await deleteUserService(userID)
    if (check != undefined && check) {
        res.json({
            Message: "Account deleted successfully!"
        })
    } else {
        const error: ErrorUser = {
            statusCode: 500,
            statusText: "Bad Request",
            message: "Internal Server error!"
        }
        res.status(error.statusCode).json(error)

    }


}

export async function deleteUserAdminHandler(req: Request, res: Response) {
    

    const adminID = (req as any).userID;
    console.log("[adminID]", adminID)
    const check = await deleteUserService(req.body.userid)
    if (check != undefined && check) {
        res.json({
            Message: "Account deleted successfully!"
        })
    } else {
        const error: ErrorUser = {
            statusCode: 500,
            statusText: "Bad Request",
            message: "Internal Server error!"
        }
        res.status(error.statusCode).json(error)

    }
}


export async function imageUploadHandler(req: Request, res: Response) {
    const userID = (req as any).userID;

    const filePath = req.file?.path

    if (filePath != undefined) {

        const check = await imageUploadService(userID, filePath)
        if (check && check != undefined) {
            res.json({
                URL: `http://localhost:8080/${filePath}`,
                Message: "Image Uploaded successfully!"
            })
        } else {
            res.status(500).json({ Message: "Something went wrong!" })
        }
    } else {

        res.status(400).json({ Message: "Please upload the profile Image!!" })
    }



}


export async function imageUploadAdminHandler(req: Request, res: Response) {


    const adminID = (req as any).userID;
    const userID = req.body.userid
    const filePath = req.file?.path
    console.log("[User Handler]",adminID)
    console.log("[User Handler]", userID)

    if (filePath != undefined) {
        const check = await imageUploadService(userID, filePath)
        if (check && check != undefined) {
            res.json({
                URL: `http://localhost:8080/${filePath}`,
                Message: "Image Updated successfully!"
            })
        } else {
            res.status(500).json({ Message: "Something went wrong!" })
        }
    } else {

        res.status(400).json({ Message: "Please upload the profile Image!!" })
    }

}
