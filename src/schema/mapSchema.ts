import mongoose from 'mongoose'
import mongoServer from '../utils/useMongoDB'

mongoose.connect(mongoServer)
mongoose.set('useFindAndModify', false)

const Schema = mongoose.Schema

const mapSchema = new Schema({
  src: {
    type: String,
    required: true
  },
  roughness: {
    type: Number,
    required: true
  },
  metalness: {
    type: Number,
    required: true
  },
  scale: {
    type: Number,
    required: true
  },
  isCurrentMap: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: true
  }
})

export default mongoose.model('Map', mapSchema)
