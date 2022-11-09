require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cors = require('cors')
//DB
const connectDB = require("./db/connect");

//Routes
const userRouter = require('./routes/userRoutes')
const blogRouter = require('./routes/blogRoutes')

const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')

//middleware
app.use(cors())
app.use(express.json())

//morgan
const morgan = require('morgan')
app.use(morgan('tiny'))

app.use('/api/v1/user',userRouter)
app.use('/api/v1/blog',blogRouter)

app.get("/", (req, res, next) => {
  res.send("Blog Site");
});

app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

//BLOG BEAST
const start = async () => {
  try {
    const port = process.env.PORT || 5000;
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}... `)
    );
  } catch (err) {
    console.log(err);
  }
};
start();


