const mongoose = require('mongoose');


exports.download_image = (req, res) => {
    const db = mongoose.connection.db;

    const id = new mongoose.Types.ObjectId(req.query.id);

    db.collection('images').findOne({_id: id}).then(imgDoc => {
        const mimetype = imgDoc.mimetype;

        const buffer = imgDoc.data.toString('base64');
        const buff = Buffer.from(buffer, 'base64');
        
        res.setHeader('content-type', mimetype);

        res.send(buff);
    })  

}