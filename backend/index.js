import express from "express";
import cors from "cors";
import router from "./routes/rfp.route.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
