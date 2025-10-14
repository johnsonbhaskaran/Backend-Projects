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
  //? take the refresh token from the user
  const refreshToken = req.body.token;
  //? send error if there is no token or Invalid token
  if (!refreshToken) return res.status(401).json("You are not authenticated");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid.");
  }
  //? Verify token with jwt
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    err && console.log(err);
    //? Deleting or Invalidating old refresh token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    //? Generate new access and refresh tokens
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);
    //? Push refresh token to the array
    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
  //? If everything is ok, create new access token and refresh token, send to user
});

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "15s",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH_SECRET);
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const foundUser = users.find((user) => user.username === username && user.password === password);

  if (foundUser) {
    //? Generate access token
    const accessToken = generateAccessToken(foundUser);
    //? Generate refresh token
    const refreshToken = generateRefreshToken(foundUser);
    //? Adding generated Refresh token to the array
    refreshTokens.push(refreshToken);
    res.status(200).json({
      username: foundUser.username,
      isAdmin: foundUser.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(403).json("username or password incorrect");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader || !authHeader.includes("Bearer")) {
    res.json("NO auth in header");
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json("Token invalid");
    }
    req.user = payload;
    next();
  });
};

app.delete("/api/user/:userId", verify, (req, res) => {
  const { userId } = req.params;
  const { id, isAdmin } = req.user;

  if (Number(userId) === id || isAdmin) {
    res.status(200).json("User has been deleted.");
  } else {
    console.log({ userId, id, isAdmin });
    res.status(403).json("You are not allowed to delete this user!");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
