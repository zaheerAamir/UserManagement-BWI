import userSchema, { LoginUserDTO, User } from "../schema/user.schema.js";


export async function createUserRepo(email: String, name: String, salt: String, hashPass: String) {
    try {
        const user = await userSchema.create({
            email: email,
            name: name,
            salt: salt,
            hashPass: hashPass
        })
        console.log("[User Repo]", user)
        return user

    } catch (error) {
        console.error("[User Repo]", error)

    }
}


export async function loginUserRepo(email: String) {

    try {
        const users: User[] = await userSchema.find({ email: email })
        console.log("[User Repo]", users)

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