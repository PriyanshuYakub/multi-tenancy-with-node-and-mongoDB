const express = require('express');
const { getTenantModel } = require('./admin');
const { getCustomerModel } = require('./tenatntdb');

const app = express();

const port = 3000;

app.get("/tenant", async(req, res)=>{
    let tenantId = req.query.tenantId;
    let tenantModel = await getTenantModel();
    const tenant = new tenantModel({id: tenantId, name: tenantId});
    let doc = await tenantModel.findOneAndUpdate({id:tenantId}, {id: tenantId});

    if(!doc){
        //tenant not found so making a new tenant
        tenant.save(function(err){
            //if error handle it
        });

    }
    res.send(JSON.stringify(tenant));
})

app.get('/customer', async(req, res)=>{
    let tenantId = req.query.tenantId;
    let customerName = req.query.customer;
    let tenantModel = await getTenantModel();

    let tenant = await tenantModel.findOne({id: tenantId});

    if(!tenant){
        //if tenant doesn't exist taht means customer of that tenant doesn't exist
        return res.sendStatus(404);
    }

    let customerModel = await getCustomerModel(tenantId);
    const customer = new customerModel({customerName});
    let doc = await customerModel.findOneAndUpdate({customerName}, {customerName});
    if(!doc){
        customer.save(function(err){
            //add customer to its respective database
            //handle error
        });
    }

    res.send(JSON.stringify(customer));
});

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});