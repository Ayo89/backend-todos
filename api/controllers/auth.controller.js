const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')


const signup = async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    const user = await User.create(req.body)
    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '7d'})
    res.status(200).json(token)
  } catch (error) {
    res.status(500).send('Error Creating user')
  }

}

const login = async (req, res, next) => {
  try {
    const user = await User.findOne({where: {email: req.body.email,}})
    if(!user){
      return res.status(400).send('User email or password incorrect')
    }
    
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if(err || !result){
        console.log(err)
        return res.status(400).send('User email or password incorrect')
      }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(200).json({token})
     })
  } catch (error) {
    console.log(error)
    res.status(500).send('Error: Cannot log in', error)
  }
}


module.exports = {
  signup,
  login
}