const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'basic',
    enum: ["basic", "supervisor", "developer", "admin", "superadmin"]
  },
  accessToken: {
    type: String
  }
})

const RoleSchema = new Schema({
  Level: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  Flag: { // if Flag: true then, display only this access level images
    type: Boolean,
    required: true
  },
  Read: {
    type: Boolean,
    required: true
  },
  Update: {
    type: Boolean,
    required: true
  },
  Delete: {
    type: Boolean,
    required: true
  }
})

const ImageSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Size: {
    type: Number, 
    required: true
  },
  AccessLvl: {
    type: Number,
    required: true
  }
})

const User = mongoose.model('user', UserSchema)
const Role = mongoose.model('roles', RoleSchema)
const Image = mongoose.model('images', ImageSchema)

module.exports = {
  User: User,
  Role: Role,
  Image: Image
}