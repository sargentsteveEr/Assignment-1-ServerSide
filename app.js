//All your code goes in this file
const express = require('express');
const Datastore = require ('nedb');
const app = express();

//app.listen(3000, () => console.log('listening at 3000'))
app.use(express.static('public'));
app.use(express.json({ limit: '100mb' }));

const db = new Datastore('database.db');
db.loadDatabase();

app.get('/api', (request, response) => {
    console.log('Got a GET request!'); 
    db.find({}, (err, docs) => {
        response.json(docs);
    })
});

app.get('/api/search', (request, response) => {
    console.log('Got a GET.QUERY request!'); 

    db.find(request.query, (err, docs) => {
        if (docs.length > 0) {
            response.json(docs)
        } else {
            response.status(400)
            response.json({
                error: "card not found",
            })
        }
    })
});

app.post('/api', (request, response) => {
    console.log('Server: Got a POST request!');
   // console.log(request.body);

    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    const ERROR = {
        error: "lol bad"
    }

    if (Object.keys(data).includes("Name")) {
        response.status(201);
        console.log(data);

        db.insert(data, (err,docs)=>{
            response.json(docs);
        });
        console.log('Server: Sucessful POST request!');


    } else {
        response.status(400);
        response.json(ERROR)

        console.log('Server: Failed POST request!');
    }

    console.log('Server: POST request processed!...');
});

app.put('/api/:theID', (request, response) => {
    console.log('Server: Got a PUT request!');
    let id = request.params.theID;
    let options = {upsert:true, returnUpdatedDocs:true}
    const data = request.body;
    data._id = id

    const ERROR = {
        error: "lol bad"
    }

    if (Object.keys(data).includes("Name")) {

        db.update({_id:id}, data, options,( err, num, docs, upsert) => {
            if(upsert){
                response.status(201) // Upsert if nothing exists
                console.log('Server: Sucessful PUT.UPSERT request!');
            } else {
                response.status(200) // Update if exists
                console.log('Server: Sucessful PUT.UPDATE request!');
            }
            response.json(docs);  
        });

    } else {

        response.status(400);
        response.json(ERROR);

    }

    console.log('Server: PUT request processed!...');

}) // Make sure to check text doc for code

app.delete("/api/:theID", (request, response) => {
    console.log('Server: Got a DELETE request!');
    let id = request.params.theID;
    const data = request.body;
    data._id = id

    const ERROR = {
        error: "lol bad"
    }



      db.remove({_id:id}, { multi: true }, (err, numRemoved) => {
        if (numRemoved > 0) {
            response.status(204)
            response.json(numRemoved)
        } else {
            response.status(404)
            response.json({
                error: "card not found",
            })
        }
    })

    db.remove({confirmation: null}, {multi: true}, (err, numRemoved) => {
        console.log("Server: Deleted " + numRemoved + " database file")
    });

})
//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = app;

