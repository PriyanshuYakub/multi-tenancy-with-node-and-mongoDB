const {connect} = require('./db-connect');

const mongoose = require('mongoose');

const url = "mongodb://0.0.0.0:27017/multi_tenant_admin";


let db;

const tenantSchema = new mongoose.Schema({
    id: String,
    name: String,

}, {timestamps:true});


const tenantModel = mongoose.model("tenant", tenantSchema);


const getDb = async() => {
return db ? db:await connect(url);

};

const getTenantModel = async() => {
    const adminDb = await getDb();

    return adminDb.model("tenants", tenantSchema);
};

module.exports = {
    getTenantModel,
}
