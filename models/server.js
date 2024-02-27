const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../db/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.studentPath = "/api/students";
    this.professorPath = "/api/professors";
    this.coursePath = "/api/courses";
    this.authPath = "/api/auth";

    this.conectarDB();
    this.middlewares();
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    this.app.use(express.static("public"));
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.studentPath, require("../routes/student.routes"));
    this.app.use(this.professorPath, require("../routes/professor.routes"));
    this.app.use(this.coursePath, require("../routes/course.routes"));
    this.app.use(this.authPath, require("../routes/auth.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor ejecutándose y escuchando el puerto", this.port);
    });
  }
}

module.exports = Server;
