import express from "express";
import routes from "./src/routes/crmRoutes.js";

const app = express();
const PORT = 8000;

routes(app);

app.get("/", (req, res) => {
  res.send(`Node and Express server is running on PORT ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
