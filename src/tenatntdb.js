const {connect} = require('./db-connect');
const mongoose = require('mongoose');

const url = "mongodb://0.0.0.0:27017";

let db;

const customerSchema = new mongoose.Schema({
    customerName: String,
},{timestamps:true});

const customerModel = mongoose.model("customers", customerSchema);

const getDb = async() => {
    return db ? db:await connect(url);
    
    };

const getTenantDb = async(tenantId) => {
    const dbName = `tenant-${tenantId}`;
    db = db ? db:await connect(url);
    let tenantDb = db.useDb(dbName, {useCAche:true});
    return tenantDb;
};


const getCustomerModel = async(tenantId) => {
    const tenantDb = await getTenantDb(tenantId);
    return tenantDb.model("customers", customerSchema);
};

module.exports = {
    getCustomerModel,
}