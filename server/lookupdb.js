import * as dotenv from 'dotenv'
import { MongoClient, ServerApiVersion } from 'mongodb';
dotenv.config();

export class StoreDatabase {
    constructor(url) {
        this.url = url;
    }

    // connect to the TSLookUp database given the client connection url
    async connect() {
        this.client = await MongoClient.connect(this.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1,
        });
        this.db = this.client.db("store");
        this.departments = this.db.collection("departments");
        this.items = this.db.collection("items");                         
    }


    // create a new department in the departments collection
    async createDepartment(name) {
        const res = await this.departments.insertOne({ type: "departments", name});
        return res;
    }

    // get all departments
    async getAllDepartments() {
        const res = await this.departments.find({}).toArray();
        return res;
    }

    /** pdelete a department from database
     * @Param {string} name - name of department to delete
     * 
     * 
     **/ 
    async deleteDepartment(name) {
        const res = await this.departments.deleteOne({name});
        return res;
    }

    // get all items in a specific department
    async getAllItems(department) {
        const res = await this.items.find({type: department}).toArray();
        return res;
    }

    // add item in a department
    // item: {_id: string, itemInfo: string, price: number}
    // department: string
    async addItem(item) {
        const res = await this.items.insertOne({type: item._id, itemInfo: item.itemInfo, price: item.price})
        return res;
    }

    // update item in a department
    // item: {_id: string, itemInfo: string, price: number}
    // department: string
    async updateItem(item) {
        const res = await this.items.updateOne({itemInfo: item.itemInfo}, {$set: {price: item.price}});
        return res;
    }

    // delete an item
    async deleteItem(item) {
        const res = await this.items.deleteOne({itemInfo: item.itemInfo});
        return res;
    }

    // close client connection
    async close() {
        this.client.close();
    }
}

async function test() {
    let v = new StoreDatabase();
    await v.connect();
    await v.departments.deleteMany();
    await v.createDepartment("test");
    console.log(await v.getAllDepartments());
    await v.close();
}