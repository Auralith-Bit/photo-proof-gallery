import app from "./app.js"
import config from "./config/config.js"
import connectDB from "./config/db.js"


const startServer = async ()=>{
    await connectDB();

    app.listen(config.port, ()=>{
        console.log(`app is running at port ${config.port}`);
    });
};

startServer();