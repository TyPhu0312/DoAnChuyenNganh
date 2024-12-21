const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const colors = require("colors");
const db = require("./models");
const connection = require("./database/db");
const routerProduct = require("./routes/product.routes");
const routerUser = require("./routes/user.routes");
const routerRole = require("./routes/role.routes");
const routerCategory = require("./routes/category.routes");
const routerCustomPainting = require("./routes/custompainting.routes");
const routerGallery = require("./routes/gallery.routes");
const routerOrder = require("./routes/order.routes");
const routerOrderDetail = require("./routes/orderdetail.routes");
const routerProvider = require("./routes/provider.routes");
const routerAuth = require("./routes/auth.routes");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const order = require("./routes/order");


//màu báo DB đang chạy
const morgan = require("morgan");
const { FORCE } = require("sequelize/lib/index-hints");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware of morgan lib
app.use(morgan("dev"));
app.use("/api/admin/products", routerProduct);
app.use("/api/admin/user", routerUser);
app.use("/api/admin/role", routerRole);
app.use("/api/admin/category", routerCategory);
app.use("/api/admin/custompainting", routerCustomPainting);
app.use("/api/admin/gallery", routerGallery);
app.use("/api/admin/order", routerOrder);
app.use("/api/admin/orderdetail", routerOrderDetail);
app.use("/api/admin/provider", routerProvider);
app.use("/api/admin/auth", routerAuth);

// API Backend để lấy số liệu thống kê

app.use("/public", express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "dev") {
  db.sequelize.sync({ force: true }).then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`.bgGreen.black);
    });
  });
} else {
  db.sequelize.sync({ alter: true }).then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`.bgBlue.black);
    });
  });
}
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/order", order);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

module.exports = app;
