import mongoose from 'mongoose'
import mongoServer from '../utils/useMongoDB'

mongoose.connect(mongoServer)

const Schema = mongoose.Schema

// 设计用户的字段
const userSchema = new Schema({
  createDate: {
    type: Date,
    default: new Date().getTime()
  },
  nickname: {
    type: String,
    require: true
  },
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  extend: {
    type: Object,
    default: {}
  }
})

export default mongoose.model('User', userSchema)
