import { useState } from "react";
import "./App.css";
import axios from "axios";
import FormInput from "./components/FormInput";

function App() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      label: "Username",
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
    },
  ];

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/login", {
        username: values.username,
        password: values.password,
      });
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);

    try {
      await axiosInstance.delete("/users/" + id, {
        headers: { Authorization: "Bearer " + user.accessToken },
      });
      setSuccess(true);
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // console.log(values);

  return (
    <>
      <div className='app'>
        {!user ? (
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            {inputs.map((input) => {
              return (
                <FormInput
                  key={input.id}
                  {...input}
                  value={values[input.name]}
                  onChange={onChange}
                />
              );
            })}
            <button>Submit</button>
          </form>
        ) : (
          <div className='formInput bg'>
            <h1>
              Welcome to <b>{user.isAdmin ? "Admin" : "User"}</b> dashboard {user.username}
            </h1>
            <h3>Delete Users:</h3>
            <button onClick={() => handleDelete(1)}>Delete John</button>
            <button onClick={() => handleDelete(2)}>Delete Jane</button>
            {error && <span>You are not allowed to delete this user!</span>}
            {success && <span>User deleted successfully!</span>}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
