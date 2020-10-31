const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')

const router = express.Router()

router.post('/api/signup', async (req, res) => {
    const { email, password } = req.body

    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const user = await User.findOne({ email })

    if (!email && !password) {
        return res.status(422).send({ error: "Must provide email & password" })
    }

    if (!email) {
        return res.status(423).send({ error: "Kindly enter your email" })
    }

    if(!regexp.test(email)){
        return res.status(421).send({error: "Email id not Valid"})
    }

    if (!password) {
        return res.status(424).send({ error: "Kindly enter your password" })
    }

    if(password.length < 6){
        return res.status(425).send({error: "Password length should be minimum 6 characters"})
    }

    if (user) {
        return res.status(404).send({ error: "User already registered. Please Signin" })
    }

    try {
        const user = new User({ email, password })
        await user.save()

        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
        res.send({ token })
    } catch (err) {
        return res.status(422).send(err.message)
    }
})


router.post('/api/signin', async (req, res) => {
    const { email, password } = req.body
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email && !password) {
        return res.status(422).send({ error: "Must provide email & password" })
    }

    if (!email) {
        return res.status(423).send({ error: "Kindly enter your email" })
    }

    if(!regexp.test(email)){
        return res.status(421).send({error: "Email id not Valid"})
    }

    if (!password) {
        return res.status(424).send({ error: "Kindly enter your password" })
    }

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).send({ error: "User not found. Please Register" })
    }

    try {
        await user.comparePassword(password)
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
        res.send({ token })
    } catch (err) {
        return res.status(425).send({error: "Invalid email or password"})
    }


})

module.exports = router