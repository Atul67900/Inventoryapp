const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/usersControllers");
const upload = require("../multerconfig/storageConfig");

//routes

router.post("/product/register",upload.single("user_profile"),controllers.userpost);
router.get("/product/details", controllers.userget);
router.get("/product/:id", controllers.singleUserGet);
router.put("/product/edit/:id",upload.single("user_profile"),controllers.productedit);
router.delete("/product/delete/:id",controllers.productdelete);
router.put("/product/status/:id",controllers.productstatus);
router.get("/productsexport",controllers.productExport);



module.exports = router