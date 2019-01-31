const express = require('express');
const router = express();
const mongoose = require('mongoose');
const passport = require('passport');

//load Person Schema
const Person = require('../../models/Person');
//Load Profile schema
const Profile = require('../../models/Profile');

// @type        GET
// @route       /api/profile
// @desc        Profile for the Particular User
// @access      Private

router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (!profile) {
                return res.json({
                    profilenotfound: 'Profile not found'
                })
            }
            res.json(profile);
        })
        .catch(err => console.log('Error in Profile'))
})

// @type        POST
// @route       /api/profile
// @desc        Profile for UPDATING/SAVE the Particular User
// @access      Private

router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const profileValues = {}
    profileValues.user = req.user.id;
    if (req.body.username) profileValues.username = req.body.username;
    if (req.body.country) profileValues.country = req.body.country;
    if (req.body.website) profileValues.website = req.body.website;
    if (req.body.portfolio) profileValues.portfolio = req.body.portfolio;
    if (typeof req.body.languages !== undefined) {
        profileValues.languages = req.body.languages.split(',');
    }
    profileValues.social = {};
    if (req.body.youtube) profileValues.social.youtube = req.body.youtube;
    if (req.body.facebook) profileValues.social.facebook = req.body.facebook;
    if (req.body.insta) profileValues.social.insta = req.body.insta;

    //do database stuff
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (profile) {
                Profile.findOneAndUpdate({
                        user: req.user.id
                    }, {
                        $set: profileValues
                    }, {
                        new: true
                    })
                    .then(profile => res.json(profile))
                    .catch(err => console.log(err))
            } else {
                Profile.findOne({
                        username: profileValues.username
                    }).then(profile => {
                        if (profile) {
                            res.status(400).json({
                                usernamefound: 'user name is already there'
                            })
                        }
                        new Profile(profileValues)
                            .save()
                            .then(profile => res.json(profile))
                            .catch(err => console.log(err))
                    })
                    .catch()

            }

        })
        .catch()
})

// @type        GET
// @route       /api/profile/:username
// @desc        getting particular user profile using username
// @access      Public

router.get('/:username', (req, res) => {
    Profile.findOne({
            username: req.params.username
        }).populate('user', ['name', 'profilepic'])
        .then(profile => {
            if (!profile) {
                return res.status(404).json({
                    username: 'username is not found'
                })
            } else {
                res.json(profile)
            }
        })
        .catch(err => console.log(err))
})

// @type        DELETE
// @route       /api/profile/user/delete
// @desc        Deleting particular user profile using username
// @access      PRIVATE

router.delete('/user/delete', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
        user: req.user.id
    });
    Profile.findOneAndRemove({
            user: req.user.id
        })
        .then(() => {
            Person.findOneAndRemove({
                    _id: req.user.id
                })
                .then(() => res.json({
                    sucess: 'deleted successfully'
                }))
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

// @type        POST
// @route       /api/profile/workrole
// @desc        Adding workrole for particular user profile using username
// @access      PRIVATE

router.post('/workrole', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const newWork = {
                role: req.body.role,
                company: req.body.company,
                from: req.body.from,
                to: req.body.to
            };
            profile.workrole.push(newWork);
            profile.save()
                .then(profile => res.json(profile))
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

// @type        GET
// @route       /api/profile/user/everyone
// @desc        Getting all profiles of EVERY USER
// @access      PUBLIC

router.get('/user/everyone', (req, res) => {
    Profile.find()
        .then(profiles => {
            res.json(profiles)
        })
        .catch(err => console.log(err))
})

module.exports = router;