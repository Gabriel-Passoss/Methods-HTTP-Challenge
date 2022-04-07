const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(customer => customer.username === username)

  if(!user) {
    return response.status(400).json({ error: 'User not found'})
  }

  request.user = user

  return next()
}

//Method to create a user
app.post('/users', (request, response) => {
  const { name, username } = request.body

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists" });
  }

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: [],
  })

  response.status(201).send()
  console.log(users)
});

//Method to list the to-do's of an user
app.get('/todos/', checksExistsUserAccount, (request, response) => {
  const { user } = request

  return response.json(user.todos)
});

//Method to create a to-do
app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body
  const { user } = request 

  const todoOperation = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todoOperation)

  return response.status(201).json(todoOperation)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;