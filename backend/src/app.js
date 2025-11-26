import express from "express";

const app = express();  // create an express app

app.use(express.json()); // middleware to parse JSON request bodies

// routes import
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

// routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);

// example route: http://localhost:4000/api/v1/users/register

export default app;

