const express = require('express');
const app = express();
const db = require("quick.db");
const jwt = require('jsonwebtoken');
const config = require('./config.json');
const bodyParser = require('body-parser');
const justify = require('./justify.js');

// Interprétation du body de la requête
app.use(express.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse an text body into a string
app.use(bodyParser.text({ type: 'text/plain' }));

// authentification
app.post('/api/token', (req, res) => {

    if(!req.body.email){
        return res.json({ 
            success: false, 
            message: 'Authentication failed. email not found.'
        });
    }
    let user = db.fetch(`user_${req.body.email}`)


    if (!user) {
        const payload = {
            email: req.body.email
        };
        const token = jwt.sign(payload, config.secretKey, {
            expiresIn: '24h'
        });
        db.set(`user_${req.body.email}`, {"email": req.body.email, "token": token, "words": 0, "date": new Date()});
        res.json({ 
            status: "success",
            message: 'New user, your security token:',
            token: token
        });
    } else {

        const payload = {
            email: user.email
        };
        const token = jwt.sign(payload, config.secretKey, {
            expiresIn: '24h'
        });
        db.set(`user_${req.body.email}`, {"email": req.body.email, "token": token, "words": 0, "date": new Date()});
        // let token = {words : 0, date: new Date()};
        res.json({
            status: "success",
            message: 'Your security token:',
            token: token
        });
    }
});


app.post('/api/justify', (req,res) => {
    // Vérification du token
    let token = req.headers['token'];
    if(!token){
        return res.json({ status: "error", message: 'Failed to authenticate token.' });
    }
    jwt.verify(token, config.secretKey, function(err, decoded) {
        if (err) {
            return res.json({ status: "error", message: 'Failed to authenticate token.' });
        } else {
            req.decoded = decoded;
        }
    });

    console.log(token);
    db.all().forEach((element) => {
        // Récupération de l'utilisateur correspondant au token
        let userdb = element.ID.startsWith(`user_`);
        if (!userdb) return;
        console.log(element.data);
        if (token !== db.fetch(`${element.ID}.token`)) return res.json({ status: "error", message: 'Failed to authenticate token.' });
        let user = db.fetch(element.ID);

        // TEST Date > 24h
        let day = new Date(user.date).getTime();
        let currentDate = new Date().getTime();
        if (currentDate-day >= 86400000) {
            // reset de la date et des mots
            db.set(`${element.ID}.date`, new Date());
            db.set(`${element.ID}.words`, 0);
        }

        // TEST Body vide
        if(Object.keys(req.body).length === 0) return res.json({ status: "error", message: 'Please specify your text in the body' });
        const array = req.body.split(/\n|\s/);

        // Ajout du nombre de mots dans la db
        user.words += array.length;
        db.add(`${element.ID}.words`, array.length)

        // TEST nombre de mots total
        if(user.words > 80000)
            res.status(402).json({ status: "error", message: '402 Payment Required.' });
        else {
            let index = 0;
            let text = [""];
            array.forEach((str) => {
                if (text[index].length + str.length <= 80) {
                    text[index] += str + ' ';
                } else {
                    text[index] = text[index].substr(0, text[index].length - 1);
                    if (text[index].length !== 80) {
                        let fill = 80 - text[index].length;
                        const re = /\s/g;
                        let spaces = [];
                        while ((match = re.exec(text[index])) !== null) {
                            spaces.push(match.index);
                        }
                        spaces = spaces.reverse();
                        let i = 0;
                        while (fill > 0) {
                            text[index] = text[index].split('');
                            text[index].splice(spaces[i], 0, ' ');
                            text[index] = text[index].join('');
                            i++;
                            fill--;
                        }
                    }
                    index++;
                    text[index] = "";
                    text[index] += str + ' ';
                }
            });
            text[index] = text[index].substr(0, text[index].length - 1);
            text = text.join("\n");
            return res.send(justify(req.body, 80));
        }


    });
});

// affiche tous les utilisateurs
app.get('/api/users', (req,res) => {
    users = [];
    db.all().forEach((element) => {
        const user = element.ID.startsWith(`user_`);
        if (!user) return;
        users.push(element.ID.split('_')[1]);
    });
    res.json(users);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
});

console.log(justify("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", 80));