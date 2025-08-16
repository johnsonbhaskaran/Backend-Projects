const routes = (app) => {
  app
    .route("/contact")
    .get((req, res) => res.send("GET request sucessfull"))
    .post((req, res) => res.send("POST request sucessfull"));

  app
    .route("/contact/:contactId")
    .put((req, res) => res.send("PUT request sucessfull"))
    .delete((req, res) => res.send("DELETE request sucessfull"));
};

export default routes;
