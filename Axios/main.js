// const { default: axios } = require("axios");

// AXIOS GLOBALS
axios.defaults.headers.common["X-Auth-Token"] =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

//* GET REQUEST
function getTodos() {
  //? Defining each parameter
  // axios({
  //   method: "get",
  //   url: "https://jsonplaceholder.typicode.com/todos",
  //   params: {
  //     _limit: 5,
  //   },
  // })
  //   .then((res) => showOutput(res))
  //   .catch((err) => console.log(err));
  //? Shorter version
  // axios
  //   .get("https://jsonplaceholder.typicode.com/todos?_limit=5")
  //   .then((res) => showOutput(res).catch((err) => console.log(err)));
  //? GET is the default method - can skip 'GET'
  axios("https://jsonplaceholder.typicode.com/todos?_limit=5")
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
  //? request with Timeout - 5ms (return error)
  // axios("https://jsonplaceholder.typicode.com/todos?_limit=5", { timeout: 5 })
  //   .then((res) => showOutput(res))
  //   .catch((err) => console.error(err));
}

//* POST REQUEST
function addTodo() {
  // ? Defining each parameter
  // axios({
  //   method: "post",
  //   url: "https://jsonplaceholder.typicode.com/todos",
  //   data: {
  //     title: "New ToDo",
  //     completed: false,
  //   },
  // })
  //   .then((res) => showOutput(res))
  //   .catch((err) => console.log(err));

  //? Shorter version
  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      data: { title: "Another todo", completed: true, userId: 23 },
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

//* PUT/PATCH REQUEST
function updateTodo() {
  //? PUT - Update entirely - complete update
  // axios
  //   .put("https://jsonplaceholder.typicode.com/todos/2", {
  //     title: "Updated todo",
  //     completed: true,
  //   })
  //   .then((res) => showOutput(res))
  //   .catch((err) => console.log(err));

  //? PATCH - Update incrementally - adds value to the existing
  axios
    .patch("https://jsonplaceholder.typicode.com/todos/2", {
      title: "Updated todo",
      completed: true,
      userId: 45,
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

//* DELETE REQUEST
function removeTodo() {
  //? DELETE - removes the requested item
  axios
    .delete("https://jsonplaceholder.typicode.com/todos/2")
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

//* SIMULTANEOUS DATA
function getData() {
  //? Fetch two or more API endpoints in single request
  // axios
  //   .all([
  //     axios.get("https://jsonplaceholder.typicode.com/todos"),
  //     axios.get("https://jsonplaceholder.typicode.com/posts"),
  //   ])
  //   .then((res) => {
  //     console.log(res[0]);
  //     console.log(res[1]);
  //     showOutput(res[0]);
  //   })
  //   .catch((err) => console.log(err));

  //? Using axios spread - to spread response array
  axios
    .all([
      axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5"),
      axios.get("https://jsonplaceholder.typicode.com/posts?_limit=5"),
    ])
    .then(axios.spread((todos, posts) => showOutput(posts)))
    .catch((err) => console.log(err));
}

//* CUSTOM HEADERS
function customHeaders() {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JSON Token",
    },
  };

  axios
    .post(
      "https://jsonplaceholder.typicode.com/todos",
      {
        title: "Another todo",
        completed: true,
        userId: 23,
      },
      config
    )
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

//* TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  const options = {
    method: "post",
    url: "https:jsonplaceholder.typicode.com/todos",
    data: {
      title: "Hi mom",
      completed: false,
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };

  axios(options).then((res) => showOutput(res));
}

//* ERROR HANDLING
function errorHandling() {
  axios("https://jsonplaceholder.typicode.com/todosERROR")
    .then((res) => showOutput(res))
    .catch((err) => {
      if (err.response) {
        //? Server responded with a status other than 200 range
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      }

      if (err.response.status === 404) {
        alert("404 page not found!");
      } else if (err.request) {
        //? Request was made but no response
        console.error(err.request);
      } else {
        console.error(err.message);
      }
    });

  //? Reject only if status is greater or equal to 500
  // axios("https://jsonplaceholder.typicode.com/todosERROR", {
  //   validateStatus: function (status) {
  //     return status < 500; //? Reject only if status is greater or equal to 500
  //   },
  // })
  //   .then((res) => showOutput(res))
  //   .catch((err) => {
  //     if (err.response) {
  //       //? Server responded with a status other than 200 range
  //       console.log(err.response.data);
  //       console.log(err.response.status);
  //       console.log(err.response.headers);
  //     }

  //     if (err.response.status === 404) {
  //       alert("404 page not found!");
  //     } else if (err.request) {
  //       //? Request was made but no response
  //       console.error(err.request);
  //     } else {
  //       console.error(err.message);
  //     }
  //   });
}

//* CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios("https://jsonplaceholder.typicode.com/todos", {
    cancelToken: source.token,
  })
    .then((res) => showOutput(res))
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log("Request cancelled", thrown.message);
      }
    });

  if (true) {
    source.cancel("Request canceled");
  }
}

//* INTERCEPTING REQUESTS & RESPONSES

axios.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//* AXIOS INSTANCES

const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// axiosInstance.get("/comments").then((res) => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document.getElementById("transform").addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
