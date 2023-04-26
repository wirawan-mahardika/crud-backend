import app from "./src/app.js";
import { config } from "dotenv";

config();
const PORT = process.env.PORT;
app.listen(PORT, () => console.log("server is listening at port " + PORT));
