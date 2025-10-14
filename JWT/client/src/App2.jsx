import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./app2.css";

const App2 = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const refreshToken = async () => {
    try {
      //api request
      const response = await axios.post("http://localhost:5000/api/refresh", {
        token: user.refreshToken,
      });
      setUser({
        ...user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwtDecode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["Authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //api request
      const response = await axios.post("http://localhost:5000/api/login", { username, password });
      setUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);
    try {
      //api request
      await axiosJWT.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          authorization: "Bearer " + user.accessToken,
        },
      });
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div>
      <div className='container'>
        {user ? (
          <div className='wrapper'>
            <h1>
              Welcome to the {user.isAdmin ? "Admin" : "User"} dashboard {user.username}
            </h1>
            <p>
              <mark>Delete users:</mark>
            </p>
            <div className='btn-container'>
              <button onClick={() => handleDelete(1)} className='btn-delete'>
                Delete John
              </button>
              <button onClick={() => handleDelete(2)} className='btn-delete'>
                Delete Jane
              </button>
            </div>
            {success && <p>user has been deleted successfully!</p>}
            {error && <p>you are not allowed to delete this user!</p>}
          </div>
        ) : (
          <form className='wrapper'>
            <h1>Login</h1>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              type='text'
              name='username'
              id='username'
              placeholder='Username'
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              name='password'
              id='password'
              placeholder='Password'
            />
            <input type='checkbox' name='' id='' />
            <button onClick={handleSubmit} type='submit'>
              Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default App2;
