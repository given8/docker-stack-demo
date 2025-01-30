const express = require('express')
const redis = require('redis')
const { MongoClient, ServerApiVersion } = require('mongodb')

const app = express()
app.set('view-engine','ejs')
app.use(express.json())
app.use(express.urlencoded())
const port = 3000

const mongoUri = "mongodb://user:pass@mongo:27017"

const mongo = new MongoClient(mongoUri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

const redisClient = redis.createClient({ url: "redis://redis:6379" })
redisClient.connect()

/**
 * 
 * @param {Express} app 
 * @param {MongoClient} mongoClient 
 */
async function start(app, mongoClient,port) {
    try {
        await mongoClient.connect()

        await mongoClient.db("test").command({ ping: 1 })
        console.log("successfully connected to mongodb")

        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    } finally {
        // mongoClient.close()
    }
}

start(app, mongo,port).catch(console.dir)

app.get("/", async (req, res) => {
    const numVisit = await redisClient.get("page-visit")
    redisClient.incr("page-visit")
    const cursor = await mongo.db("test").collection("posts").find()
    const posts = []
    while (cursor.hasNext){
        const post = await cursor.next()
        if(!post){
            break;
        }
        posts.push(post)
    }
    res.render('index.ejs',{numVisit,posts})
})

app.get("/new", async (req,res)=>{
    res.render('new.ejs')
})

app.post("/new",async (req,res)=>{
    const {body,title} = req.body
    try {
        await mongo.db("test").collection("posts").insertOne({title:title,body:body})
        res.redirect("/")
        }catch(e){
            console.log(e)
            res.status(400)
    }
})

app.delete("/delete", async ()=>{
    mongo.db("test").collection("posts").deleteMany()
    res.status(204)
})