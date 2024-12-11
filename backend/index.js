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
const routerCategory = require('./routes/category.routes')
const routerCustomPainting = require('./routes/custompainting.routes')
const routerGallery = require('./routes/gallery.routes')
const routerOrder = require('./routes/order.routes')
const routerOrderDetail = require('./routes/orderdetail.routes')
const routerProvider = require('./routes/provider.routes')
//màu báo DB đang chạy
const morgan = require('morgan');
const { FORCE } = require('sequelize/lib/index-hints');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//middleware of morgan lib
app.use(morgan("dev"));
app.use("/api/admin/products", routerProduct);
app.use("/api/admin/user", routerUser);
app.use("/api/admin/role", routerRole);
app.use("/api/admin/category", routerCategory);
app.use("/api/admin/custompainting", routerCustomPainting );
app.use("/api/admin/gallery", routerGallery );  
app.use("/api/admin/order", routerOrder );
app.use("/api/admin/orderdetail", routerOrderDetail);
app.use("/api/admin/provider", routerProvider );

const path = require('path');
app.use('/public', express.static(path.join(__dirname, 'public')));
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

if(process.env.NODE_ENV === 'development') {
    db.sequelize.sync({ force: true }).then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    });
} else {
    db.sequelize.sync({ alter: true }).then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    });
}


