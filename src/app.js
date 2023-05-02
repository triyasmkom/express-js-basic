const express = require("express")

const app = express()

app.get('/', (req, res)=>{
    console.log('Ini Method GET')
    res.send('Ini Method GET')
})


app.listen(3001, ()=>{
    console.log("Server started on port 3001")
})
