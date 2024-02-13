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

    this.connectDB();
    this.middlewares();
    this.routes();
  }

  async connectDB() {
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
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server executing and listening in port", this.port);
    });
  }
}

module.exports = Server;
