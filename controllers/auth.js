


const Realm = require('realm-web');
const app = new Realm.App({ id: process.env.REALM_URI});
const mongoose = require('mongoose');



exports.post_login = (req, res) => {
    console.log('login');
    db = mongoose.connection.db;

    if (!req.body.email) {
        return res.status(400).send({ message: 'No email in request body' });
    } else if (!req.body.password) {
        return res.status(400).send({ message: 'No password in request body' });
    }

    const email = req.body.email;
    const password = req.body.password;
    const credentials = Realm.Credentials.emailPassword(email, password);


    app.logIn(credentials).then(userData => {
        const userEmail = userData._profile.data.email;
        req.session.email = userEmail;
        console.log(req.session.email);
        return res.status(200).send(userData);
    }).catch(error => {
        // return res.status(400).send({ message: error});
      

    })
}



exports.post_signup = (req ,res) => {
    if (!req.body.email) {
        return res.status(400).send({ message: 'No email in request body' });
    } else if (!req.body.password) {
        return res.status(400).send({ message: 'No password in request body' });
    }

    const email = req.body.email;
    const password = req.body.password;
    const credentials = Realm.Credentials.emailPassword(email, password);
    console.log('email', email, 'password', password);

    app.emailPasswordAuth.registerUser({email, password}).then(() => {

        app.logIn(credentials).then(userData => {
            const userEmail = userData._profile.data.email;
            req.session.email = userEmail;
            
            return res.status(200).send(userData);

        }).catch(error => {
        return res.status(400).send({ message: error});
        })

    }).catch(error => {
        return res.status(400).send({ message: error});
    })
}


exports.get_logout = (req, res) => {
    req.session.destroy(() => {
        console.log('session deleted');
        return res.end();
    })
}

exports.get_isAuth = (req, res, next) => {
    if (req.session.email) { 
        const email = req.session.email;
        res.status(200).send({ email: email });
    } else {
        res.status(200).send({ email: null });
    }


}

exports.get_isAdmin = (req, res) => {
    const user = req.session.email;
    if(user === 'testy@gmail.com') {
        res.send(true);
    } else {
        res.send(false);
    }
}