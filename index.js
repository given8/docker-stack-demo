const express = require('express')
const redis = require('redis')
const { MongoClient, ServerApiVersion } = require('mongodb')

const app = express()
const port = 3000

const mongoUri = "mongodb://user:pass@localhost:27017"

const mongo = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

const redisClient = redis.createClient({ url: "redis://localhost:6379" })
redisClient.connect()

app.get("/", async (req, res) => {
    const numVisit = await redisClient.get("page-visit")
    redisClient.incr("page-visit")
    res.send("Hello World " + numVisit)
})

/**
 * 
 * @param {Express} app 
 * @param {MongoClient} mongoClient 
 */
async function start(app, mongoClient) {
    try {
        await mongoClient.connect()

        await mongoClient.db("test").command({ ping: 1 })
        console.log("successfully connected to mongodb")

        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    } finally {
        mongoClient.close()
    }
}

start(app, mongo).catch(console.dir)