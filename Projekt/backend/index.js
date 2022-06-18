const express = require('express')
const app = express()
const Nwd = require('./models/Nwd')
const nwd = (a, b) => {
    if (a == b) return a
    else {
        if ( a > b ) return nwd(a-b, b)
        else return nwd(a, b-a)
    }
}


app.get("/nwd/results", async (req, res) => {
    const result = await Nwd.find({})
    res.send({
        results: result
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
      //const insert = await pclient.query(`INSERT INTO data (results) VALUES (${result});`)
      const insert = await Nwd.init()
        .then(async () => {
            const c = await Nwd.create({
                first: num1,
                second: num2,
                result: result
            })
        })
        .catch(err => {
            console.log(err.message)
            return res.send(`error: ${err.message}`)
        })
      res.send(`${result}`)
    }
    else if (redischeck2) {
      console.log("getting from cache...")
      const result = await rclient.get(`${num2}/${num1}`)
      const insert = await Nwd.init()
      .then(async () => {
          const c = await Nwd.create({
              first: num1,
              second: num2,
              result: result
          })
      })
      .catch(err => {
          console.log(err.message)
          return res.send(`error: ${err.message}`)
      })
      res.send(`${result}`)
    }
    else {
      console.log("calculating...")
      const result = nwd(parseInt(num1), parseInt(num2))
      const rinsert = await rclient.set(`${num1}/${num2}`, result)
      const insert = await Nwd.init()
      .then(async () => {
          const c = await Nwd.create({
              first: num1,
              second: num2,
              result: result
          })
      })
      .catch(err => {
          console.log(err.message)
          return res.send(`error: ${err.message}`)
      })
      res.send(`${result}`)
    }
})

const Redis = require("ioredis");

const rdbConnData = {
  port: 6379,
  host: '127.0.0.1',
};
const rclient = new Redis(rdbConnData);

require('dotenv').config();
const dbConnData = {
    host: process.env.MONGO_HOST || '127.0.0.1',
    port: process.env.MONGO_PORT || 27017,
    database: process.env.MONGO_DATABASE || 'local'
};

const mongoose = require('mongoose');

rclient.on('error', err => {
    console.error('Error connecting to Redis', err);
  });
  rclient.on('connect', () => {
      console.log(`Connected to Redis.`)
      const port =  5000
      app.listen(port, () => {
        console.log(`API server listening at http://localhost:${port}`);
      });
  });

  mongoose
  .connect(`mongodb://${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(response => {
    console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
  })
  .catch(error => console.error('Error connecting to MongoDB', error));