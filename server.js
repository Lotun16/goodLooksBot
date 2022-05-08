const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');


//express app
const app = express();

//heroku stuff
const PORT = process.env.PORT || 8080;

//mongo DB
const dbURI = 'mongodb+srv://lotunKO:goodpass@dbotgl.ybgbj.mongodb.net/dbotgl?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then((result) => {
        console.log('CONNECTED TO MONGO DB');
        app.listen(PORT, console.log(`Server is starting at port ${PORT}`));
    })
    .catch((err) => {
        console.log(err);
    })

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!'); 
})


//middleware
app.use(express.json());                           
app.use(express.urlencoded({ extended: true}))  
app.use(morgan('dev'));

//routes
// app.use('/api', apiRoutes);
// app.use('/bugs', bugPostRoutes);

