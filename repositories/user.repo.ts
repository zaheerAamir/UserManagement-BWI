import mongoose, { Types } from "mongoose";
import userSchema, { LoginUserDTO, User } from "../schema/user.schema.js";


export async function createUserRepo(email: string, name: string, salt: string, hashPass: string) {
    try {
        const refresh_token = ""
        const user = await userSchema.create({
            email: email,
            name: name,
            salt: salt,
            hashPass: hashPass,
            refreshToken: refresh_token,
            role: "User"
        })
        console.log("[User Repo]", user)
        return user

    } catch (error) {
        console.error("[User Repo]", error)

    }
}

export async function createAdminRepo(email: string, name: string, salt: string, hashPass: string) {

    try {
        const refresh_token = ""
        const user = await userSchema.create({
            email: email,
            name: name,
            salt: salt,
            hashPass: hashPass,
            refreshToken: refresh_token,
            role: "Admin"
        })
        console.log("[User Repo]", user)
        return user

    } catch (error) {
        console.error("[User Repo]", error)

    }

}


export async function loginUserRepo(email: string) {

    try {
        const users: User[] = await userSchema.find({ email: email })

        if (users.length == 0) {
            console.log("[User Repo] Email not found!")
            return ""

        }

        const { salt, hashPass } = users[0]
        return { salt, hashPass }




    } catch (error) {
        console.error(error)

    }
}

export async function createJWTRepo(email: string) {

    try {
        const users = await userSchema.find({ email: email })
        if (users.length != 0) {
            return users[0]._id
        }

    } catch (error) {
        console.error(error)

    }

}

export async function storeRefreshToken(refresh_token: string, userID: Types.ObjectId) {

    try {

        const result = await userSchema.updateOne(
            { _id: userID },
            { $set: { refreshToken: refresh_token } }
        )
        console.log("[User Repo]", result)


    } catch (error) {
        console.error("[User Repo]", error)
    }

}

export async function updateAccountRepo(userID: string, name: string) {

    try {

        const result = await userSchema.updateOne(
            { _id: userID },
            { $set: { name: name } }
        )
        console.log("[User Repo]", result)


    } catch (error) {
        console.error("[User Repo]", error)
    }

}

export async function updateUserRepo(adminID: string, userID: string, name: string):Promise<boolean | undefined> {

    try {

        const user = await userSchema.findById(
            { _id: adminID }
        )
        if (user != null) {
            if (user.role == "Admin") {

                const result = await userSchema.updateOne(
                    { _id: userID },
                    { $set: { name: name } }
                )
                console.log("[User Repo]", result)

                return true

            } else {
                console.error("[User Repo] Access Denied! Users are not allowed to access this route.")
                return false
            }

        }
        console.error("[User Repo] AdminID incorrect!")
        return false


    } catch (error) {
        console.error("[User Repo]", error)
    }
}


export async function refreshAccessTokenRepo(token: string): Promise<boolean | undefined> {

    try {

        const result = await userSchema.find({ refreshToken: token })
        console.log(result)
        if (result.length != 0) {
            return true
        }
        return false

    } catch (error) {
        console.error(error)
    }
}


export async function logoutRepo(userID: string): Promise<boolean | undefined> {

    try {
        const result = await userSchema.updateOne(
            { _id: userID },
            { $set: { refreshToken: "" } }
        )
        console.log("[User Repo]", result)

        if (result.matchedCount != 0) {
            return true
        }
        return false

    } catch (error) {
        console.error("[User Repo]", error)
    }

}

export async function deleteUserRepo(userID: string): Promise<boolean | undefined> {

    try {
        const result = await userSchema.deleteOne(
            { _id: userID }
        )
        console.log("[User Repo]", result)

        if (result.deletedCount == 1) {
            return true
        }
        return false

    } catch (error) {

        console.error("[User Repo]", error)
    }
}