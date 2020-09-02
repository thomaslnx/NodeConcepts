const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');
const { isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  let result = [];
  
  const repos = repositories.map(repo => {
      const final = {
        id: repo.id,
        title: repo.title,
        url: repo.url,
        techs: repo.techs,
        likes: repo.likes
      } 

      result.push(final);
    } 
    
    );

    return response.json(result);
  
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

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex === -1) {
    return response.status(400).json({
      error: 'This ID not exists'
    })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  
  if (repoIndex === -1) {
    return response.status(400).json({
      error: 'Bad Request'
    })
  } else {
    repositories.splice(repoIndex, 1);
  }

  return response.status(204).json({});
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const reposIndex = repositories.findIndex( repo => repo.id === id );

  if (reposIndex === -1) {
    return response.status(400).json({
      error: 'Bad Request'
    })
  }

  const likes = repositories[reposIndex].likes;

  repositories[reposIndex].likes = likes + 1;
  
  return response.json({likes: repositories[reposIndex].likes});
});

module.exports = app;
