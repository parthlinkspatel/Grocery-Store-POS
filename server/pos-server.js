import express from "express";
import logger from "morgan";
import {StoreDatabase} from "./lookupdb.js";
import * as dotenv from 'dotenv'
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const URL = process.env.URL;
const lookupdb = new StoreDatabase(URL);

// middleware for Express app to parse body into JS Object and parse query parameters
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger("dev"));
app.use("/", express.static("client"));

// middleware to serve POS.html file in client directory
/*app.use(function(req, res, next) {
    if (req.path === "/") {
        res.set("Content-Type", "text/html");
        res.sendFile("POS.html", {
            root: 'client'
        });
    }
    else {
        next();
    }
}); */

// route for getting all departments in database
// returns [strings] - array of department names
app.get("/getAllDepartments", async (req, res) => {
    const result = await lookupdb.getAllDepartments();
    const names = result.map(e => e.name);
    res.status(200).json(names);
});

// route for adding a new department into the database
// name parameter specifies name of department
app.post("/addDepartment/:name", async (req, res) => {
    const params = req.params;
    const result  = await lookupdb.createDepartment(params.name);
    res.status(200).json(result);
});
  
// route for deleting an existing department in database
// name parameter specifies name of department to delete
app.delete("/deleteDepartment/:name", async (req, res) => {
    const params = req.params;
    const result = await lookupdb.deleteDepartment(params.name);
    res.status(200).json(result);
})

// route for getting all items associated with a department
// department parameter specifies name of department from which to get items
app.get("/getAllItems/:department", async (req, res) => {
    const params = req.params;
    const result = await lookupdb.getAllItems(params.department);
    res.status(200).json(result);
});

// route for creating item associated with a department
// department parameter specifies name of department in which to add item
app.post("/addItem", async (req, res) => {
    const result = await lookupdb.addItem(req.body);
    res.status(200).json(result);
});

// route for updating item price associated with a department if it exists in database
// department name, item name, and new price will be shared in body
// this route recieves JSON data and sends JSON data
app.put("/updateItemPrice", async (req, res) => {
    const result = await lookupdb.updateItem(req.body);
    res.status(200).json(result);
});

// route for deleting an item in a department
// department parameter specifies department from which to delete item
// item parameter specifies name of item
app.delete("/deleteItem", async (req, res) => {
    const result = await lookupdb.deleteItem(req.body);
    res.status(200).json(result);
})

// connects to database and starts server
async function initServer() {
    await lookupdb.connect();
    app.listen(port, () => {
        console.log("listening on port " + port);
    })
}

initServer();