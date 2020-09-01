const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {
    title,
    url,
    techs,
  } = request.body;
  
  const id = uuid();
  const likes = 0;

  if (!isUuid(id)) {
    return response.status(400).json({
      error: 'Id is invalid!'
    });
  }

  const project = { 
    id,
    title,
    url,
    techs,
    likes
  };

  repositories.push(project)

  return response.json(project);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoId = repositories.map( repo => {
    if (repo.id === id) {
      repo.title = title;
      repo.url = url;
      repo.techs = techs;
    } else {
      return response.status(400).json({
        error: 'Id is invalid!',
      })
    }

    repositories[repo.id] = repo;

    return response.json(repo);
  });
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  repositories.splice(repoIndex, 1);

  return response.json(repositories);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const reposIndex = repositories.findIndex( repo => repo.id === id );
  const likes = repositories[reposIndex].likes;

  repositories[reposIndex].likes = likes + 1;
  
  return response.json(repositories);
});

module.exports = app;
