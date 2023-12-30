import { createUserRepo, loginUserRepo } from "../repositories/user.repo.js";
import { ErrorUser, LoginUserDTO, User, UserDTO } from "../schema/user.schema.js";
import bcrypt from "bcrypt";

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


export async function loginUserService(user: LoginUserDTO): Promise<LoginUser | undefined> {

    let loginStatus: LoginUser = {
        status:  false,
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