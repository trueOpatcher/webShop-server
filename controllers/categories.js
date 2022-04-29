const Category = require("../models/category");
const mongoose = require('mongoose');


exports.get_categories = (req, res, next) => {
    const db = mongoose.connection.db;
    const categories = [];
    
    db.collection('categories').find({}, { projection: { _id: 0 } }).forEach(category => {

        categories.push(category);
        


    }).then(() => {

        if (categories === null) return res.status(200).send(categories);

        return res.status(200).send(categories);

    }).catch(error => { return res.status(400).send({ error }) })

}

exports.get_all = (req, res) => {
    const db = mongoose.connection.db;

    const items = [];
    
    db.collection('categories').find({}).forEach(category => {

        for(let item of category.items) {
            items.push(item);
        }

        for(let subCategory of category.subCategories) {
            for(let item of subCategory.items) {
                items.push(item);
            }
        }

    }).then(() => {

        return res.status(200).send({ items: items, catName: 'All'});

    }).catch(error => {
        return res.status(400).send(error);
    })

}



exports.post_categories = (req, res, next) => {
    const db = mongoose.connection.db;


    if (!req.body.name) return res.status(400).send({ error: 'no category name in req body' });


    const item = req.body.item;
    const name = req.body.name;

    db.collection('categories').findOne({ name: name }).then(category => {

        if (category != null && item) {
            const items = category.items;
            const update = category.items.push(item);

            db.collection('categories').updateOne({ name: name }, { $set: { items: update } }).then(doc => {
                console.log(doc);
            })

        } else if (category != null) {
            return res.status(406).send({ error: 'category existrs' });
        }

        if (category == null) {
            db.collection('categories').insertOne({ name: name, items: [] }).then(() => {
                return res.status(200).send();
            })
        }


    })

}

exports.post_sub_categories = (req, res, next) => {
    const db = mongoose.connection.db;

    if (!req.body.categoryName && !req.body.subName) return res.status(400).send({ error: 'no category name in req body' });

    const categoryName = req.body.categoryName;
    const subName = req.body.subName;

    db.collection('categories').updateOne({ name: categoryName }, { $push: { subCategories: { name: subName, items: [] } } }).then(() => {

        return res.status(200).send();

    }).catch(error => {
        return res.status(400).send(error);
    })

}

exports.delete_category = (req, res, next) => {
    const db = mongoose.connection.db;

    const catName = req.body.categoryName;


    db.collection('categories').findOne({name: catName}).then(category => {

        const objIds = [];

        for(let item of category.items) {

            let id = item.imageUrl.split('?id=');
            let objId = new mongoose.Types.ObjectId(id[1]);

            objIds.push(objId);
        }

        if(category.subCategories) {
            for (let subCategory of category.subCategories) {
                for (let item of subCategory.items) {
    
                    let id = item.imageUrl.split('?id=');
                    let objId = new mongoose.Types.ObjectId(id[1]);
    
                    objIds.push(objId);
                }
            }
        }
        
        console.log(objIds);

        db.collection('images').deleteMany({ _id: { $in: objIds } }).then(() => {

            db.collection('categories').deleteOne({ name: catName }).then(() => {
                return res.status(200).send();
            })

        });

    })
    
}

exports.delete_sub_category = (req, res) => {
    const db = mongoose.connection.db;

    const catName = req.body.categoryName;
    const subName = req.body.subName;

    db.collection('categories').findOne({ name: catName }).then(doc => {
        let objIds = [];

        for (let subCategory of doc.subCategories) {
            for (let item of subCategory.items) {

                let id = item.imageUrl.split('?id=');
                let objId = new mongoose.Types.ObjectId(id[1]);

                objIds.push(objId);
            }
        }

        db.collection('images').deleteMany({ _id: { $in: objIds } }).then(() => {

            db.collection('categories').updateOne({ name: catName }, { $pull: { subCategories: { name: subName } } }).then(doc => {
                res.status(200).send();
            })

        });

    })
    // db.collection('categories').updateOne({name: catName}, { $pull: {subCategories: {name: subName}}}).then(doc => {
    //     res.status(200).send();
    // })
    // db.collection('categories').deleteOne({name: catName}).then(() => {
    //     return res.status(200).send();
    // })
}