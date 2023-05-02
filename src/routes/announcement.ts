import { NextFunction, Request, Response } from 'express'

import express from 'express'
import Announcement from '../schema/announcementSchema'
import ResultJSON from '../utils/ResultJSON'

const router = express.Router()

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  // res.send('respond with a resource')
  res.json({
    tip: 'success'
  })
})

// 推送新公告
router.post('/addNewAnnouncement', async (req: Request, res: Response) => {
  const body = req.body

  if (body.title === '') {
    res.status(400).json(ResultJSON.BAD_REQUEST('参数 title 未填写'))
  }

  if (body.content === '') {
    res.status(400).json(ResultJSON.BAD_REQUEST('参数 content 未填写'))
  }

  try {
    new Announcement({
      title: body.title,
      content: body.content,
      date: new Date().getTime()
    }).save()

    res.status(200).json(ResultJSON.SUCCESS('公告添加成功'))
  } catch (err) {
    res.status(400).json(ResultJSON.BAD_REQUEST())
  }
})

// 获取公告消息
router.get('/getAnnouncements', async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find()
    res.status(200).json(ResultJSON.SUCCESS(announcements))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 删除公告消息
router.get('/delAnnouncement', async (req: Request, res: Response) => {
  try {
    await Announcement.deleteOne({
      _id: req.query.id
    })
    res.status(200).json(ResultJSON.SUCCESS('删除成功'))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

export default router
