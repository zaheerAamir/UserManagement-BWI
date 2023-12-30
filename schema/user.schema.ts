import { Schema, model } from "mongoose";

export interface User {
    email: string,
    name: string,
    salt: string,
    hashPass: string
}

export interface UserDTO {
    email: string,
    name: string,
    password: string
}

export interface ErrorUser {
    statusCode: number,
    statusText: string,
    message: string
}

const userSchema = new Schema<User>({
    email: String,
    name: String,
    salt: String,
    hashPass: String
})

export default model<User>("User", userSchema, "User")

export interface LoginUserDTO {
    email: string,
    password: string
}
