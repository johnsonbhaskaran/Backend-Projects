import "dotenv/config.js";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

const users = [
  {
    id: 1,
    username: "john",
    password: "John1234",
    isAdmin: true,
  },
  {
    id: 2,
    username: "jane",
    password: "Jane1234",
    isAdmin: false,
  },
];

let refreshTokens = [];

app.post("/api/refresh", (req, res) => {
  const refreshToken = req.body.token;

  //? check refresh token
  if (!refreshToken) return res.status(401).json("You are not Authenticated");
  if (!refreshTokens.includes(refreshToken))
    return res.status(403).json("Refresh token not valid!");

  //? Verify refresh token with JWT
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    err && console.log(err);

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "5s",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH_SECRET);
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  //? Find username, password match with DB data
  const foundUser = users.find((u) => u.username === username && u.password === password);

  //? Access denied - username or password mismatch
  if (!foundUser) return res.status(401).json("Username or Password incorrect!");

  //? User found in DB
  //* generate access token and refresh token
  const accessToken = generateAccessToken(foundUser);
  const refreshToken = generateRefreshToken(foundUser);
  refreshTokens.push(refreshToken);

  //? Send response to the user
  res.status(200).json({
    username: foundUser.username,
    isAdmin: foundUser.isAdmin,
    accessToken,
    refreshToken,
  });
});

const verify = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  //? verifying authHeader
  if (!authHeader || !authHeader.includes("Bearer"))
    return res.status(403).json("NO auth in header");

  //? extract token string from authHeader
  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, payload) => {
    //* Token Invalid
    err && console.log(err);

    //? No error - Send the payload as user object
    //* Payload contains id and isAdmin value
    req.user = payload;
    next();
  });
};

app.delete("/api/users/:userId", verify, (req, res) => {
  const { userId } = req.params;
  const { id, isAdmin } = req.user;

  if (Number(userId) === id || isAdmin) {
    return res.status(200).json("User Deleted successfully!");
  } else {
    return res.status(403).json("You are not allowed to perform Delete action.");
  }
});

app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.token;

  //? Remove refresh token from the DB
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

  //? send response to User
  res.status(200).json("You logged out successfully!");
});

app.listen(PORT, () => {
  console.log(`Server2 running at localhost: ${PORT}`);
});
