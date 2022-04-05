const express = require('express')
const app = express()

const nwd = (a, b) => {
    if (a == b) return a
    else {
        if ( a > b ) return nwd(a-b, b)
        else return nwd(a, b-a)
    }
}

app.get("/nwd/results", async (req, res) => {
    const result = await pclient.query("SELECT results FROM data;")
    res.send({
        results: result.rows.map(r => r.results)
    })
})

app.get("/nwd/:num1/:num2", async (req, res) => {
    const num1 = req.params.num1
    const num2 = req.params.num2
    const redischeck1 = await rclient.exists(`${num1}/${num2}`)
    const redischeck2 = await rclient.exists(`${num2}/${num1}`)
    if (redischeck1) {
      console.log("getting from cache...")
      const result = await rclient.get(`${num1}/${num2}`)
      const insert = await pclient.query(`INSERT INTO data (results) VALUES (${result});`)
      res.send(`${result}`)
    }
    else if (redischeck2) {
      console.log("getting from cache...")
      const result = await rclient.get(`${num2}/${num1}`)
      const insert = await pclient.query(`INSERT INTO data (results) VALUES (${result});`)
      res.send(`${result}`)
    }
    else {
      console.log("calculating...")
      const result = nwd(parseInt(num1), parseInt(num2))
      const rinsert = await rclient.set(`${num1}/${num2}`, result)
      const insert = await pclient.query(`INSERT INTO data (results) VALUES (${result});`)
      res.send(`${result}`)
    }
})

const Redis = require("ioredis");

const rdbConnData = {
  port: 6379,
  host: '127.0.0.1',
};
const rclient = new Redis(rdbConnData);

const pdbConnData = {
    host: '127.0.0.1',
    port: 5432,
    database: 'nwd',
    user: 'postgres',
    password: 'password'
};

const { Client } = require('pg')
const pclient = new Client(pdbConnData)

rclient.on('error', err => {
    console.error('Error connecting to Redis', err);
  });
  rclient.on('connect', () => {
      console.log(`Connected to Redis.`)
      const port =  3000
      app.listen(port, () => {
        console.log(`API server listening at http://localhost:${port}`);
      });
  });

pclient
  .connect()
  .then(async () => {
    console.log('Connected to PostgreSQL');
    
  })
  .catch(err => console.error('Connection error', err.stack));