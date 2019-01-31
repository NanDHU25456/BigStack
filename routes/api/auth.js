const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose');
const key = require('../../setup/myurl');

// @type        GET
// @route       /api/auth
// @desc        just for testing
// @access      Public
router.get('/', (req, res) => {
    res.json({
        test: 'test auth is successfull'
    });
});

//Import Person schema for registering Person
const Person = require('../../models/Person');

// @type        POST
// @route       /api/auth/register
// @desc        Register the Usr
// @access      Public
router.post('/register', (req, res) => {
    Person.findOne({
            email: req.body.email
        })
        .then(person => {
            if (person) {
                return res
                    .status(404)
                    .json({
                        emailerror: 'This email is aleady registered'
                    })
            } else {
                const newPerson = new Person({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                //hash the password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPerson.password, salt, (err, hash) => {
                        // if (err) throw err;
                        newPerson.password = hash;
                        newPerson
                            .save()
                            .then(person => res.json(person))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
        .catch(err => console.log(err))
})

// @type        POST
// @route       /api/auth/login
// @desc        login the Usr
// @access      Public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Person.findOne({
            email
        })
        .then(person => {
            if (!person) {
                return res.status(400).json({
                    loginerror: 'person is not registered'
                })

            }
            //compare the password
            bcrypt.compare(password, person.password)
                .then(isCorrect => {
                    if (isCorrect) {
                        // res.json({
                        //     success: 'User login successfully'
                        // });
                        // Use payload and create token for user
                        const payload = {
                            id: person.id,
                            name: person.email,
                            password: person.password
                        };
                        jsonwt.sign(
                            payload, key.secret, {
                                expiresIn: 60 * 60
                            }, (err, token) => {
                                // if (err) throw err;
                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                })
                            });
                    } else {
                        res.json({
                            passworderror: 'password mismatched'
                        });
                    }
                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
})

// @type        GET
// @route       /api/auth/profile
// @desc        Profile of the User
// @access      Private

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        name: req.user.name,
        email: req.user.email,
        profilepic: req.user.profilepic
    })
})

module.exports = router;