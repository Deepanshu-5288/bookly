import app from "./app.js";

import connectDb from "./config/database.js";

connectDb();

app.listen(process.env.PORT, () =>{
    console.log(`Server started at ${process.env.PORT}`);
})