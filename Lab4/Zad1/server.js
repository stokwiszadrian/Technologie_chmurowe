const express = require("express")
const req = require("express/lib/request")
const app = express()


app.get("/", async (req, res) => {
    res.send("Hello from my node app!")
})

app.listen(8080, () => {
    console.log("Server listening on port 8080")
})