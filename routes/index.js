var express = require('express');
var router = express.Router();
const userRoute = require("./user.route");
const { loggedInMiddleware } = require("../middlewares");

/* GET home page. */
router.get('/', loggedInMiddleware.loggedIn, (req, res) => {
  res.render('index', { loggedIn: res.locals.loggedIn });
});

router.use("/user", userRoute);

module.exports = router;
