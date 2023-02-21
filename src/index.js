    const express = require('express');
const { getTenantModel } = require('./admin');
const { getCustomerModel } = require('./tenatntdb');
const fs = require('firebase-admin');
const serviceAccount = require('./key.json');fs.initializeApp({
 credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();
const app = express();

const port = 3000;

//tenant if using mongo
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

//handling customers
app.get('/customer', async(req, res)=>{
    let tenantId = req.query.tenantId;
    let customerName = req.query.customer;
    let tenantModel = await getTenantModel();

    let tenant = await tenantModel.findOne({id: tenantId});
    
    try {
    const userRef = db.collection("admin").doc(tenantId);
    const response = await userRef.get();
    if(response.status() == 200){
        let customerModel = await getCustomerModel(tenantId);
    const customer = new customerModel({customerName});
    let doc = await customerModel.findOneAndUpdate({customerName}, {customerName});
    if(!doc){
        customer.save(function(err){
            //add customer to its respective database
            //handle error
        });
    }
    }
  } catch(error) {
    res.send(error);
  }
    /*
    if(!tenant){
        //if tenant doesn't exist taht means customer of that tenant doesn't exist
        return res.sendStatus(404);
    }*/

   /* let customerModel = await getCustomerModel(tenantId);
    const customer = new customerModel({customerName});
    let doc = await customerModel.findOneAndUpdate({customerName}, {customerName});
    if(!doc){
        customer.save(function(err){
            //add customer to its respective database
            //handle error
        });
    }*/

    res.send(JSON.stringify(customer));
});

//for admin in firebase creation
app.get('/create', async (req, res) => {
  try {
    console.log(req.body);
    const id = req.query.tenantId;
    const userJson = {
      ID: req.query.tenantId,
      tenantNme: req.query.tenantId,
    };
    const usersDb = db.collection('admin'); 
    const response = await usersDb.doc(id).set(userJson);
    res.send(JSON.stringify(response));
  } catch(error) {
    res.send(error);
  }
});

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
});
