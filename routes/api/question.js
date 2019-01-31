const express = require('express');
const router = express();
const mongoose = require('mongoose');
const passport = require('passport');

//load Person Schema
const Person = require('../../models/Person');
//Load Profile schema
const Profile = require('../../models/Profile');
//Load Question schema
const Question = require('../../models/Question');

// @type        GET
// @route       /api/question
// @desc        get all questions
// @access      Public
router.get('/', (req, res) => {
    Question.find()
        .then(questions => res.json(questions))
        .catch(err => console.log(err))
});

// @type        GET
// @route       /api/question/delete/:id
// @desc        delete all questions for one particular user
// @access      PRIVATE

router.get('/deleteall/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    for (let index = 1; index <= 3; index++) {
        Question.findOneAndRemove({
                user: req.params.id
            })
            .then(() => res.json({
                deletesuccess: 'successfully deleted a question'
            }))
            .catch(err => console.log('unable to delete all question'))

    }
})

// @type        POST
// @route       /api/question
// @desc        Route for adding question
// @access      Private
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const newQuestion = new Question({
        user: req.user.id,
        textone: req.body.textone,
        texttwo: req.body.texttwo,
        name: req.user.name
    })
    newQuestion.save()
        .then(question => res.json(question))
        .catch(err => console.log('unable to push question ' + err))
});


// @type        GET
// @route       /api/question/test2
// @desc        Route for testing methods and learning 
// @access      Private
router.get('/test2', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Question.find({
            user: req.user.id
        })
        .then(questions => {
            var len = questions.length;
            res.redirect('/api/question/test')
        })
        .catch(err => console.log('error in test 2 ' + err))
})

// @type        GET
// @route       /api/question/test
// @desc        Route for testing methods and learning 
// @access      Private
router.get('/test', (req, res) => {
    Question.deleteMany()
        .then(() => {
            res.json({
                s: 'sss'
            })
        })
        .catch(err => err);
})

// @type        GET
// @route       /api/question/upvotes/
// @desc        Route for adding upvotes for particular user
// @access      Private

router.get('/upvotes/:q_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Question.findById(req.params.q_id)
        .then(question => {
            if (question.upvotes.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0) {
                console.log(question.upvotes.pop());
                question.save()
                    .then(question => res.json({
                        downvote: 'successfully downvoted'
                    }))
                    .catch(err => console.log(err))

            } else {
                var obj = {};
                obj.user = req.user.id;
                question.upvotes.push(obj);
                question.save()
                    .then(question => res.json(question))
                    .catch(err => console.log('error in upvoting ' + err))
            }
        })
        .catch(err => console.log(err))
})

module.exports = router;