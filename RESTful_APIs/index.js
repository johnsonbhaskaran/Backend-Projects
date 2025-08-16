import express from "express";

const app = express();
const PORT = 8000;

app.get("/", (req, res) => {
  res.send(`Node and Express server is running on PORT ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
