import express from "express"
import routes from "./src/routes.js"
import connectDB from "./util/user.util.js"

const app = express()
const PORT = 8080
app.use(express.json())


app.listen(PORT, () => { 
    connectDB()
    routes(app)
    console.log(`Server is running on Port: ${PORT}`) 
})
