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
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  extend: {
    type: Object,
    default: {}
  }
})

export default mongoose.model('User', userSchema)
