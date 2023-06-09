import express from "express";
import { config } from "dotenv";
import { ErrorMiddleWare } from "./middleWares/Error.js";

config({
    path:"./config/config.env"
})
const app =express();

app.use(express.json());
app.use(
    express.urlencoded({
        extended:true
    })
)


import user from "./routes/userRoute.js";
import hotel from "./routes/hotelsRoute.js";
app.use("/api/v1", user);
app.use("/api/v1", hotel);
app.use(ErrorMiddleWare);
export default app;