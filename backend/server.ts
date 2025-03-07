import express from "express";
import router from "./routes/route";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerDocs from "./config/swagger";

const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static('uploads'));

app.use("/api", router);

app.get("/", (req, res)=>{
    res.send("Ok");
});

app.listen(3001, ()=>{
    swaggerDocs(app, 3001)
    console.log("App listening on port 3001");
});
