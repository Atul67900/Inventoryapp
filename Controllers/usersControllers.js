const products = require("../models/usersSchema");
const moment = require("moment");
const csv = require("fast-csv");
const fs = require("fs");
const BASE_URL = process.env.BASE_URL

//Register Product
exports.userpost = async(req,res)=>{
    const file = req.file.filename;
    const {pname, pcode, pquantity, status} = req.body;

    if(!pname || !pcode || !pquantity || !status || !file){
        res.status(401).json("All Inputs are Required")
    }
    try {
        const preuser = await products.findOne({pcode:pcode});

        if(preuser){
            res.status(401).json("This Item is already Exists in Our DataBase")
        }else{

            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss")

            const productData = new products({
                pname, pcode, pquantity, status, profile:file, datecreated
            });
            await productData.save();
            res.status(200).json(productData)
        }
    } catch (error) {
        res.status(401).json(error);
        console.log("Catch Block error");
    }
}   



//Get Product

exports.userget = async(req,res)=>{

    const search = req.query.search || ""

    const status = req.query.status || ""

    const sort = req.query.sort || ""

    const page = req.query.page || 1

    const ITEM_PER_PAGE = 50;

    const query = {
        pcode : {$regex:search,$options:"i"}
    }
    if(status !== "All"){
        query.status = status
    }

    try {

        const skip = (page - 1) * ITEM_PER_PAGE 

        const count = await products.countDocuments(query)
        
        
        const productsdata = await products.find(query)
        .sort({datecreated:sort == "new" ? -1 : 1})

        .limit(ITEM_PER_PAGE)
        .skip(skip)

        const pageCount = Math.ceil(count/ITEM_PER_PAGE);


        res.status(200).json({
            Pagination:{
                count,pageCount
            },
            productsdata

        
        })
    } catch (error) {
        res.status(401).json(error)
    }
}


//single Product Get

exports.singleUserGet = async(req,res)=>{

    const {id} = req.params;

    try {
        const productdata = await products.findOne({_id:id});
        res.status(200).json(productdata)
    } catch (error) {
        res.status(401).json(error)
    }
}

//update product

exports.productedit = async(req,res)=>{
    const {id} = req.params;
    const {pname, pcode, pquantity, status, user_profile} = req.body;
    const file = req.file ? req.file.filename : user_profile

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateProduct = await products.findByIdAndUpdate({_id:id},{
            pname, pcode, pquantity, status, profile:file, dateUpdated
        },{
            new:true
        });
        await updateProduct.save();
        res.status(200).json(updateProduct);
    } catch (error) {
        res.status(401).json(error)
    }
}

//product delete

exports.productdelete = async(req,res)=>{
    const {id} = req.params;

    try {
        const deleteProduct = await products.findByIdAndDelete({_id:id});
        res.status(200).json(deleteProduct);
    } catch (error) {
        res.status(401).json(error)
    }
}

// Change status

exports.productstatus = async(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    try {
        const productStatusUpdate = await products.findByIdAndUpdate({_id:id},{status:data},{new:true});
        res.status(200).json(productStatusUpdate)
    } catch (error) {
        res.status(401).json(error)
    }
}

//Export to CSV

exports.productExport = async(req,res)=>{
    try {
        const productsData = await products.find();

        const csvStream = csv.format({ headers: true });

        if(!fs.existsSync("public/files/export")){
            if(!fs.existsSync("public/files")){
                fs.mkdirSync("public/files/")
            }

            if(!fs.existsSync("public/files/export")){
                fs.mkdir("./public/files/export")
            }
        }

        const writablestream = fs.createWriteStream(
            "public/files/export/products.csv"
        )

        csvStream.pipe(writablestream);

        writablestream.on("finish", function(){
            res.json({
                downloadUrl:`${BASE_URL}/files/export/products.csv`
            });
        });

        if(productsData.length > 0){
            productsData.map((product)=>{
                csvStream.write({
                    ProductCode:product.pcode ? product.pcode : "-",
                    ProductName:product.pname ? product.pname : "-",
                    ProductQuantity:product.pquantity ? product.pquantity : "-",
                    ProductStatus:product.status ? product.status : "-",
                    Profile:product.profile ? product.profile : "-",
                    DateCreated:product.datecreated ? product.datecreated : "-",
                    DateUpdated:product.dateUpdated ? product.dateUpdated : "-"
                })
            })
        }

        csvStream.end();
        writablestream.end();


    } catch (error) {
        res.status(401).json(error)
    }
}