const express = require('express')
const bodyparser = require('body-parser')
const route = require("./routes/route")
const { default: mongoose } = require('mongoose');
const app = express()


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Shubhangipendam:dq625jPH0u9mUkS5@cluster0.xvhyj4i.mongodb.net/test", {
    useNewUrlParser: true
})
    .then(() => console.log("Mongoose is connected"))
    .catch(err => console.log(err));



app.use("/", route)


app.listen(process.env.PORT || 3000, function () {
    console.log("Express app runing on port" + (process.env.PORT || 3000))
})

