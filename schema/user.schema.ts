import { Schema, model } from "mongoose";

export interface User {
    email: string,
    name: string,
    salt: string,
    hashPass: string
    refreshToken: string
    role: string
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
    hashPass: String,
    refreshToken: String,
    role: String
})

export default model<User>("User", userSchema, "User")

export interface LoginUserDTO {
    email: string,
    password: string
}

export interface LoginUser {
    access_token: string,
    refresh_token: string
    message: string
}

export interface JWTPayload {
    iat: number,
    userid: string,
    exp: number
}