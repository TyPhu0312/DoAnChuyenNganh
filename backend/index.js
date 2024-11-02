const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const db = require('./models');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
db.sequelize.sync({force:true}).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
app.get('/', (req, res) => {
    res.send('Hello World');
});

