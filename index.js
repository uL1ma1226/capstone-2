const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const cors = require('cors')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productsRoutes')
const orderRoutes = require('./routes/orderRoutes')
 
const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.DB_CONNECTION,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
)

let db = mongoose.connection;

db.on('error', console.error.bind(console, "Connection Error!"));
db.once('open', () => console.log("We are connected to our Cloud Database"));

app.use(cors({
    credentials: true,
    origin: [ process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2 ],
    preflightContinue: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.listen(port, () => console.log(`Server is listening to the port ${port}`));