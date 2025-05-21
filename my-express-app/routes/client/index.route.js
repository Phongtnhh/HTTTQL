const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const authRoute = require("./auth.route");
const routeRole = require("./role.route");
const authrequire = require("../../middleware/client/user.middleware");
module.exports = (app) => {
    app.use("/auth", authRoute);
    app.use("/role", routeRole);
    app.use("/products",authrequire.infoUser, productRoutes);
    app.use("/", authrequire.infoUser, homeRoutes );
   
}
