import { updateAccountRepo, createAdminRepo, createJWTRepo, createUserRepo, deleteUserRepo, loginUserRepo, logoutRepo, refreshAccessTokenRepo, storeRefreshToken, updateUserRepo } from "../repositories/user.repo.js";
import { LoginUserDTO, UserDTO } from "../schema/user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

interface LoginUser {
    status: boolean,
    message: string
}

export async function createUserService(user: UserDTO): Promise<Boolean> {
    try {
        const { email, name, password } = user
        // Generate Salt
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)

        //Concatenate salt and password
        const saltedPassword = password + salt

        //Hashing the combined string
        const hashedPassword = await bcrypt.hash(saltedPassword, saltRounds)

        createUserRepo(email, name, salt, hashedPassword)
        console.log("[User Service] User Created")
        return true

    } catch (error) {

        console.error("[User Service]", error)
        return false
    }

}

export async function createAdminService(user: UserDTO) {


    try {
        const { email, name, password } = user
        // Generate Salt
        const saltRounds = 10
        const salt = await bcrypt.genSalt(saltRounds)

        //Concatenate salt and password
        const saltedPassword = password + salt

        //Hashing the combined string
        const hashedPassword = await bcrypt.hash(saltedPassword, saltRounds)

        createAdminRepo(email, name, salt, hashedPassword)
        console.log("[User Service] User Created")
        return true

    } catch (error) {

        console.error("[User Service]", error)
        return false
    }


}


export async function loginUserService(user: LoginUserDTO): Promise<LoginUser | undefined> {

    let loginStatus: LoginUser = {
        status: false,
        message: ""
    }

    try {

        const { email, password } = user
        const saltAndHash = await loginUserRepo(email)


        if (saltAndHash != undefined && saltAndHash != "") {

            const saltedPassword = password + saltAndHash.salt

            if (await bcrypt.compare(saltedPassword, saltAndHash.hashPass)) {

                loginStatus.status = true
                loginStatus.message = "User Logged In successfully!"
                console.log("[User Service] User successfully logged In")
                return loginStatus

            } else {
                loginStatus.message = "Incorrect Password!"
                console.log("[User Service] Incorrect Password")
                return loginStatus
            }

        }
        loginStatus.message = "Email not found! User does not exist"
        return loginStatus


    } catch (error: any) {
        console.error("[User Service]", error)
        loginStatus.message = error.message
        return error
    }

}

export async function createJWT(email: string) {

    const access_token_secret = process.env.ACCESS_TOKEN_SECRET
    const userID = await createJWTRepo(email)
    console.log("[User service]", userID)

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const paylod = {
        iat: currentTimeInSeconds,
        userid: userID
    }

    let accessToken = ""
    if (access_token_secret != undefined) {
        accessToken = jwt.sign(paylod, access_token_secret, { expiresIn: "1m" })
    }

    let refreshToken = ""
    const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET
    if (refresh_token_secret != undefined) {
        refreshToken = jwt.sign(paylod, refresh_token_secret)
    }
    console.log("[User Service]", accessToken == refreshToken, "Access Token and Refresh TOken are not same!")

    if (userID != undefined) {

        storeRefreshToken(refreshToken, userID)
    }

    return { accessToken, refreshToken }

}


export async function updateAccountService(userID: string, name: string) {

    updateAccountRepo(userID, name)
}

export async function updateUserService(adminID: string, userID: string, name: string) {
    
    const check = await updateUserRepo(adminID, userID, name)
    if (check != undefined) {
       return check 
    }
    return check
}

export async function refreshAccessTokenService(token: string): Promise<String | undefined> {

    try {


        const check = await refreshAccessTokenRepo(token)
        const access_token_secret = process.env.ACCESS_TOKEN_SECRET

        const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        let accessToken = ""
        if (check && check != undefined) {
            console.log("[User service]", check)
            if (refresh_token_secret != undefined && access_token_secret != undefined) {

                jwt.verify(token, refresh_token_secret, (err, user) => {
                    if (err) {
                        console.log("[User Service]", err)
                        console.error("[User Service] Invalid token")
                        return accessToken
                    } else {

                        if (user != undefined && typeof user != 'string') {
                            console.log("[User Service]", user)
                            const paylod = {
                                iat: currentTimeInSeconds,
                                userid: user.userid
                            }

                            accessToken = jwt.sign(paylod, access_token_secret, { expiresIn: "1m" })
                            // console.log("[User Service]",accessToken)
                            return accessToken
                        } else {

                            return accessToken
                        }



                    }

                })
            } else {
                console.error("[User Service] Cannot get Refresh Token secret & Access token secret!")
            }
        }

        console.log("[User service]", check)
        return accessToken

    } catch (error) {
        console.error(error)
    }
}

export async function logoutService(userID: string) {

    const check = await logoutRepo(userID)
    if (check != undefined) {
        return check
    }
    return check
}

export async function deleteUserService(userID: string) {

    const check = await deleteUserRepo(userID)
    if (check != undefined && check) {
        return check

    }
    return check

}