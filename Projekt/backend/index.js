const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const Albums = require('./models/Albums')

app.get("/", async (req, res) => {
  res.send("Hello from API!")
})

app.get("/albums", async (req, res) => {
  const result = await Albums.find({})
  res.send({
    albums: result
  })
})

app.get("/album/:id", async (req, res) => {
  const result = await Albums.findById(req.params.id)
  res.send({
    album: result
  })
})

app.get("/recentalbums", async (req, res) => {
  const albums = await rclient.smembers("album")
  // console.log(albums)
  const response = await Promise.all(albums.map(async album => {
    const author = await rclient.hget(album, "author")
    return {
      title: album,
      author: author
    }
  }))

  console.log(response)
  // const albums = await rclient.smembers("album")
  res.send({
    albums: response
  })
})

app.post("/albums/add", async (req, res) => {
  // console.log(Object.keys(req))
  const author = req.body.author
  const title = req.body.title
  const songs = req.body.songs || []
  const insert = Albums.init()
    .then(async () => {
      await Albums.create({
        author: author,
        title: title,
        songs: songs
      })
    })
    .catch(err => {
      console.log(error)
    })
  
  const rinsert = await rclient.sadd("album", title)
  // console.log(songs)
  const rinserttitle = await rclient.hset(title, "title", title)
  const rinsertauthor = await rclient.hset(title, "author", author)
  if ( songs.length !== 0) {
    console.log("adding songs...")
    const rinsertsongs = await rclient.rpush(`${title}/songs`, songs)
  }
  const rexpire = await rclient.expire("album", 3600)
  const rexpiretitle = await rclient.expire(title, 3600)
  const rexpiresongs = await rclient.expire(`${title}/songs`, 3600)
  res.send("OK")
})


app.put("/albums/edit/:id", async ( req, res ) => {
  const author = req.body.author
  const title = req.body.title
  const songs = req.body.songs
  const update = await Albums.findById(req.params.id)
  const prevTitle = update.title
  const prevAuthor = update.author
  const prevSongs = update.songs
  update.author = author
  update.title = title
  update.songs = songs
  await update.save()
  const remove = await rclient.srem("album", prevTitle)
  const rinsert = await rclient.sadd("album", title)
  const rinserttitle = await rclient.hset(title, "title", title)
  const rinsertauthor = await rclient.hset(title, "author", author)
  await rclient.lpop(`${prevTitle}/songs`, prevSongs.length)
  if ( songs.length !== 0) {
    console.log("adding songs...")
    const rinsertsongs = await rclient.rpush(`${title}/songs`, songs)
    const rexpire = await rclient.expire("album", 3600)
  }

  res.send("OK")
})

const Redis = require("ioredis");

const rdbConnData = {
  port: 6379,
  host: 'localhost',
};
const rclient = new Redis(rdbConnData);

require('dotenv').config();
const dbConnData = {
    host: process.env.MONGO_HOST || 'localhost',
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