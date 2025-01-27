const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const authorization = require('../middlewares/auth-middleware')

// 소셜로그인 - 로그인 또는 회원가입
router.post('/users/auth', async (req, res) => {
    let { snsId, nickName } = req.body

    let user

    const existUser = await User.findOne({ snsId })
    if (existUser) {
        user = existUser
    } else {
        // 존재하는 유저가 없으면 회원 가입
        const newUser = new User({ nickName, snsId })
        await newUser.save()
        user = newUser
    }

    nickName = user.nickName
    const userId = user.userId

    const token = jwt.sign({ userId, nickName }, process.env.JWT_KEY)
    res.json({ token, message: '로그인 성공' })
})

// 회원 정보 수정
router.patch('/users', authorization, async (req, res) => {
    const { userId } = res.locals.user
    const { nickName } = req.body
    const existUser = await User.findById(userId)
    existUser.nickName = nickName
    await existUser.save()
    res.json({ message: '회원정보 수정 성공' })
})

module.exports = router
