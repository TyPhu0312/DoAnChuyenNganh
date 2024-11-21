const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const db = require('./models');
const connection = require('./database/db')
const routerProduct= require('./routes/product.routes');
const routerUser = require('./routes/user.routes')
const routerRole = require('./routes/role.routes')
//màu báo DB đang chạy
const morgan = require('morgan');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//middleware of morgan lib
app.use(morgan("dev"));
app.use("/api/admin/products", routerProduct);
app.use("/api/admin/user", routerUser);
app.use('/api/admin/role', routerRole);
// if(process.env.NODE_ENV==='development') {
//     db.sequelize.sync({force:true}).then(() => {
//         app.listen(port, () => {
//             console.log(`Server is running on port ${port}`.bgMagenta.white);
//         });
//     });
// }
// else {
//     await sequelize.sync({ alter: true });
// }

db.sequelize.sync({alter:true}).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`.bgMagenta.white);
    });
});

