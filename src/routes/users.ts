import express, { Request, Response } from 'express'
import User from '../schema/userSchema'
import ResultJSON from '../utils/ResultJSON'
import { createToken } from '../utils/tokenUtil'

const router = express.Router()

// 获取所有用户的信息
router.get('/getUsersInfo', async (req: Request, res: Response) => {
  try {
    const users = await User.find()
    res.status(200).json(ResultJSON.SUCCESS(users))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 注销用户
router.get('/delUser', async (req: Request, res: Response) => {
  console.log(req.query)

  try {
    await User.deleteOne({
      _id: req.query.id
    })
    res.status(200).json(ResultJSON.SUCCESS('删除成功'))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 更新用户信息
router.post('/updateUserInfo', async (req: Request, res: Response) => {
  const body = req.body
  try {
    await User.updateOne(
      {
        _id: body._id
      },
      {
        nickname: body.nickname,
        password: body.password
      }
    )
    res.status(200).json(ResultJSON.SUCCESS('update success'))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 登录接口
router.post('/login', async (req: Request, res: Response) => {
  const body = req.body
  console.log(body)

  let user
  try {
    user = await User.findOne({
      username: body.username ?? '',
      password: body.password ?? ''
    })

    const token = createToken({
      username: user.username,
      password: user.password,
      nickname: user.nickname
    })

    res.status(200).json(
      ResultJSON.SUCCESS({
        token: token,
        nickname: user.nickname,
        username: user.username
      })
    )
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 小程序后台管理系统登录，简易死数据校验
router.post('/adminLogin', async (req: Request, res: Response) => {
  const body = req.body

  const adminInfo = {
    username: 'admin',
    password: '123456'
  }

  if (adminInfo.username === body.username && adminInfo.password === body.password) {
    const token = createToken({
      ...adminInfo
    })
    res.status(200).json(
      ResultJSON.SUCCESS({
        token
      })
    )
  } else {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 注册接口
router.post('/regist', async (req: Request, res: Response) => {
  const body = req.body
  console.log(body)
  if (body.username === '' || body.password === '' || body.nickname === '') {
    return res.status(400).json(ResultJSON.BAD_REQUEST())
  }

  const nicknameExist = await User.find({
    nickname: body.nickname
  })
  const usernameExist = await User.find({
    username: body.username
  })

  console.log(nicknameExist, usernameExist)

  if (nicknameExist.length !== 0 || usernameExist.length !== 0) {
    return res.status(400).json(ResultJSON.BAD_REQUEST('用户名或昵称已存在'))
  }

  try {
    new User({
      username: body.username,
      password: body.password,
      nickname: body.nickname
    }).save()

    res.status(200).json(
      ResultJSON.SUCCESS({
        info: 'regist success'
      })
    )
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

export default router
