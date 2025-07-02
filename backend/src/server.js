import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

import { connectDB } from "./lib/db.js";

dotenv.config(); 

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
// it is important for our onboarding page
// using this we can access cookies inside middleware.js
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
}); 