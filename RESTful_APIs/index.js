import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./src/routes/crmRoutes.js";

const app = express();
const PORT = 8000;

// mongoose connection
// mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://johnsonb:johnsonb@ac-447rp9c-shard-00-02.xojlwxj.mongodb.net:27017,ac-447rp9c-shard-00-01.xojlwxj.mongodb.net:27017,ac-447rp9c-shard-00-00.xojlwxj.mongodb.net:27017/admin?ssl=true&appName=Cluster0&retryWrites=true&loadBalanced=false&replicaSet=atlas-1341bd-shard-0&readPreference=primary&connectTimeoutMS=10000&w=majority&authSource=admin&authMechanism=SCRAM-SHA-1"
);

// bodyParser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serving static files
app.use(express.static("public"));

routes(app);

app.get("/", (req, res) => {
  res.send(`Node and Express server is running on PORT ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
