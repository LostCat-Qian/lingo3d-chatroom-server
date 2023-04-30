import express, { Request, Response } from 'express'
import ResultJSON from '../utils/ResultJSON'
import Map from '../schema/mapSchema'

const router = express.Router()

// 新增地图
router.post('/addMap', async (req: Request, res: Response) => {
  const body = req.body
  try {
    await Map.validate(body)
    await new Map(body).save()
    res.status(200).json(ResultJSON.SUCCESS(null))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 查询所有地图信息
router.get('/queryAllMaps', async (req: Request, res: Response) => {
  try {
    const maps = await Map.find()
    res.status(200).json(ResultJSON.SUCCESS(maps))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 获取当前激活的地图信息
router.get('/getCurrentMap', async (req: Request, res: Response) => {
  try {
    const map = await Map.findOne({
      isCurrentMap: true
    })
    res.status(200).json(ResultJSON.SUCCESS(map))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

// 切换地图
router.get('/switchMapById', async (req: Request, res: Response) => {
  const { id } = req.query

  // 先将所有的数据的isCurrentMap字段都设置为false
  const maps: any[] = await Map.find()
  maps.map((item) => (item.isCurrentMap = false))
  for (let i in maps) {
    await Map.updateOne(
      {
        _id: maps[i]._id
      },
      {
        isCurrentMap: maps[i].isCurrentMap
      }
    )
  }

  try {
    // 将传来的那一项的isCurrentMap设置为true，表示当前激活的地图
    await Map.updateOne(
      {
        _id: id
      },
      {
        isCurrentMap: true
      }
    )

    res.status(200).json(ResultJSON.SUCCESS(null))
  } catch (err) {
    res.status(500).json(ResultJSON.SERVER_ERROR())
  }
})

export default router
