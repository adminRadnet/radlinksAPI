const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoUrl = `mongodb://127.0.0.1:27017`
const MongoClient = require('mongodb').MongoClient
const ObjectId = require("mongodb").ObjectId

MongoClient.connect(mongoUrl, {useUnifiedTopology: true}).then(client => {
    console.log(`Connected to database`)
    const db = client.db(`radlinks`)
    const pages = db.collection(`pages`)

    app.use(cors())
    app.use(express.static(`public`))
    app.use(bodyParser.json())
    app.set('view engine', 'ejs')

    //Show all pages
    app.get('/', (req, res)=>{
        pages.find().toArray()
            .then(results => {
                res.render('index.ejs', {pages: results})
            })
            .catch(error => console.log(error))
    })

    //Show all pages
    app.get('/pages', (req, res)=>{
        pages.find().toArray()
            .then(results => {
                res.json(results)
            })
            .catch(error => console.log(error))
    })

    //Show page with slug-name 
    app.get('/page/:id', (req, res)=>{
        let id = req.params.id
        pages.findOne({
            "_id": new ObjectId(id)
        }).then(result => {
            res.render("page.ejs", {page: result})
        }).catch(error => console.log(error))
    })
    
    //Create a page
    app.post('/pages', (req, res)=>{
        pages.insertOne(req.body)
            .then(result => {
                res.send({success: true})
            })
            .catch(error => console.log(error))
    })

    //Update a page
    app.put('/pages', (req,res)=>{
        let id = req.body.id
        pages.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {
                $set: req.body
            }, {
                $upsert: true
            }
        ).then(result => {
            res.send({success:true})
        }).catch(error => console.log(error))
    })


    //Delete a page
    app.delete('/pages', (req,res)=>{
        let id = req.body.id
        pages.deleteOne(
            {_id: new ObjectId(id)}
        ).then(result => {
            res.send({success: true})
        }).catch(error => console.log(error))
    })

    //View links
    app.get('/page/:id/links', (req, res)=>{
        let id = req.body.id
        pages.findOne({
            "_id":id
        }).toArray().then(result =>{
            let links = result.links
            res.send(JSON.stringify(links))
        })
    })

    //View Link Details
    app.get("/page/:id/link/:name", (req, res) => {
        let id = req.params.id;
        let name = req.params.name;
        console.log(name)
        pages
        .findOne({
            _id: new ObjectId(id),
        })
        .then((result) => {
            let linkR = result.links.find(link => link.linkname === name);
            res.render("link.ejs", {link: linkR});
        });
    });

    //Create a link
    app.post("/page/link", (req, res) => {
        console.log(req.body.id)
        let id = req.body.id;
        pages
        .findOneAndUpdate({
            _id: new ObjectId(id),
        },{
            $addToSet: {
                links: req.body
            }
        })
        .then((result) => {
            let links = result;
            res.send(JSON.stringify(result));
        }).catch(error => console.log(error))
    });
  

    //Update a link
     app.put("/page/link", (req, res) => {
        let id = req.body.pageid;
        let linkname = req.body.linkname;
       pages
         .findOneAndUpdate(
           {
             _id: new ObjectId(id),
             links: linkname
           },
           {
             $set: {
                "links.$": req.body,
             },
           }
         )
         .then((result) => {
           let links = result;
           res.send(JSON.stringify(result));
         })
         .catch((error) => console.log(error));
     });

    //Delete a link
    app.delete("/page/link", (req, res) => {
        let id = req.body.pageid;
        let linkname = req.body.linkname;
        console.log(linkname)
        pages
        .findOneAndUpdate({
            _id: new ObjectId(id),
        },{
            $pull: {
                links: {"linkname":linkname}
            }
        })
        .then((result) => {
            console.log(result)
            res.send(JSON.stringify(result));
        }).catch(error => console.log(error))
    });

    app.listen(3000, ()=>{
        console.log(`Listening on port 3000`)
    })
})