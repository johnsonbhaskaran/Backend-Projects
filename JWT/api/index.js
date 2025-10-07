import express from "express";
import cors from "cors";
import "dotenv/config.js";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5005;
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
  //* take refresh token from the user
  const refreshToken = req.body.token;

  //* send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    err && console.log(err);

    //* Invalidate and delete token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    //* if everything is ok, create new access token, refresh token and send to user
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
    expiresIn: "1m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_REFRESH_SECRET);
};

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username && user.password === password);

  if (user) {
    // res.json("Login successful");
    //? Generate access token
    const accessToken = generateAccessToken(user);

    //? Generate refresh token
    const refreshToken = generateRefreshToken(user);

    refreshTokens.push(refreshToken);

    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("username or password doesn't match");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader) {
    const accessToken = authHeader.split(" ")[1];

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        res.status(403).json("Token is invalid");
      }

      req.user = payload;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated!");
  }
};

app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json("User has been deleted.");
  } else {
    res.status(403).json("You are not allowed to delete this user");
  }
});

app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.token;

  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

  res.status(200).json("You logged out successfully");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
