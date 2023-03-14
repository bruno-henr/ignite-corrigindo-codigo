const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  if(!updatedRepository.url) {
    delete updatedRepository.url
  }
  if(!updatedRepository.title) {
    delete updatedRepository.title
  }
  if(!updatedRepository.techs) {
    delete updatedRepository.techs
  }
  
  if(updatedRepository.likes) {
    return response.json({
      likes: 0
    });
  }

  if (!validate(id)) {
    return response.status(404).json({
      error: 'TodoId id incorrect.'
    });
  }

  var repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  var repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex == -1) {
    return response.status(404).json({ error: "Repository not found" });
  } else if(!validate(id)) {
    return response.status(404).json({ error: "Uuid invalid" });
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  var repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json({likes: likes});
});

module.exports = app;
