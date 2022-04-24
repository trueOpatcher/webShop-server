
const mongoose = require('mongoose');
const multer = require('multer');
const Img = require('../models/img');


exports.create_item = (req, res) => {
    const db = mongoose.connection.db;
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    server_Url = process.env.SERVER_URL;
    console.log(server_Url);


    upload.single('img')(req, res, (err) => {

        if(!req.body.categoryName) return res.status(400).send({error: 'error'});

        
        const categoryName = req.body.categoryName;
        const subCategoryName = req.body.subCategoryName;
        const name = req.body.name;
        const price = req.body.price;
        const desc = req.body.desc;

        const data = req.file.buffer;
        const mimetype = req.file.mimetype;
        const size = req.file.size;

        const img = new Img({
            data: data,
            mimetype: mimetype,
            size: size
        });

        img.save().then(doc => {
            const id = doc._id.toString();
            const imageUrl = server_Url + '/image/download?id=' + id;
            
            const item =  { imageUrl: imageUrl, name: name, price: price, desc: desc };
            console.log(item);
            if(subCategoryName) {
                db.collection('categories').updateOne({name: categoryName}, { $push: { 'subCategories.$[element].items': item}}, { arrayFilters: [{'element.name': subCategoryName}],  upsert: true}).then(() => {
                    
                    res.status(200).send();
                    
                })
            }

            if(!subCategoryName) {
                db.collection('categories').updateOne({name: categoryName}, { $push: {items: item}}).then(() => {
                    
                    res.status(200).send();
                    
                })
            }
            
        })

    })
}

exports.delete_item = (req, res) => {
    const db = mongoose.connection.db;

    console.log(req.body);
    const catName = req.body.catName;
    const subName = req.body.subName;
    const itemName = req.body.itemName;

    
    // db.collection('categories').findOne({name: catName}).then( doc => {
    //     console.log(doc.items);
    //     res.end();
    // })
    if(!subName) {
        db.collection('categories').updateOne({name: catName}, { $pull:  { items: { name: itemName } }}).then( () => {
            res.status(200).send();
        })
    } else if (subName) {
        db.collection('categories').updateOne({name: catName}, { $pull: { 'subCategories.$[subName].items': { name: itemName } }}, { arrayFilters: [{ 'subName.name': subName }] }).then(() => {
            res.status(200).send();
        })
    }


    
}