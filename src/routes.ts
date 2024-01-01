import { Express } from "express";
import { updateAccountHandler, createUserHandler, healthCheck, loginUserHandler, refreshAccessTokenHandler, logoutHandler, deleteUserHandler, createAdminHandler, imageUploadHandler, imageUploadAdminHandler, updateUserNameHandler, deleteUserAdminHandler, getAllUsers } from "./handlers/user.handler.js";
import { createUserMiddleware, loginInUserMiddleware, imageUploadMiddleware, JWTTokenVerify, updateAccountNameMiddleware, updateUserNameMiddleware, imageUpdateAdminMiddleware, deleteUserMiddleware } from "./middlewares/user.middleware.js";
import multer from "multer";

function routes(app: Express) {


    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "uploads/")
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + "-" + file.originalname)
        }
    })

    const upload = multer({ storage: storage })



    app.get("/healthCheck", healthCheck)
    app.get("/getUsers", getAllUsers)

    /* *****************************Create User/Admin Account*********************** */
    app.post("/createUser", createUserMiddleware, createUserHandler)
    app.post("/createAdmin", createUserMiddleware, createAdminHandler)

    /* ********************************Login/Logout User/Admin Route**************************** */
    app.post("/login", loginInUserMiddleware, loginUserHandler)
    app.delete("/logout", JWTTokenVerify, logoutHandler)

    /* *******************************Update Account Name****************************** */
    app.put("/updateAccountName", JWTTokenVerify, updateAccountNameMiddleware, updateAccountHandler)


    /* *************************ADMIN PROTECTED ROUTES: Update user name, Update profile image************************** */
    app.put("/updateUserName", JWTTokenVerify, updateUserNameMiddleware, updateUserNameHandler)
    app.put("/imageUpdateAdmin", JWTTokenVerify, imageUpdateAdminMiddleware, upload.single("ProfileImage"), imageUploadAdminHandler)
    app.delete("/deleteUserAccount", JWTTokenVerify, deleteUserMiddleware, deleteUserAdminHandler)

    /* ***************************Refresh Access Token Route*************************** */
    app.put("/token", refreshAccessTokenHandler)

    /* ****************************Delete Account Route******************************* */
    app.delete("/deleteAccount", JWTTokenVerify, deleteUserHandler)

    /* ******************************Update User Profile image***************************** */
    app.post("/imageUpload", JWTTokenVerify, imageUploadMiddleware, upload.single("ProfileImage"), imageUploadHandler)
}

export default routes