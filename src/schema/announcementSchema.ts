import mongoose from 'mongoose'
import mongoServer from '../utils/useMongoDB'

mongoose.connect(mongoServer)

const Schema = mongoose.Schema

// 设计用户的字段
const announcementSchema = new Schema({
  date: {
    type: Date,
    default: new Date().getTime()
  },
  title: {
    type: String,
    required: true,
    default: '暂无公告'
  },
  content: {
    type: String,
    required: true,
    default: '暂无公告，请留意后续消息'
  },
  extend: {
    type: Object,
    default: {}
  }
})

export default mongoose.model('Announcement', announcementSchema)
