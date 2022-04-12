'use strict';

const express = require('express');

const app = express();
app.use(express.json())

const PORT = process.env.PGPORT;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/redis', async (req, res) => {
  const insert = await client.set(req.body.key, req.body.value)
  return res.send(insert)
})

app.get('/redis/:key', async (req, res) => {
  const get = await client.get(req.params.key)
  res.send(get)
})

const Redis = require("ioredis");

const rdbConnData = {
  port: 6379,
  host: process.env.REDIS_HOST,
};
const client = new Redis(rdbConnData);

client.on('error', err => {
  console.error('Error connecting to Redis', err);
});
client.on('connect', () => {
    console.log(`Connected to Redis.`)
    app.listen(PORT, () => {
      console.log(`API server listening at http://localhost:${PORT}`);
    });
});