const express = require('express')
const redis = require('redis')

const app = express()
const port = 3000

const client = redis.createClient({url:"redis://localhost:6379"})
client.connect()

app.get("/",async(req,res)=>{
    const numVisit = await client.get("page-visit")
    client.incr("page-visit")
    res.send("Hello World "+numVisit)
})

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
})