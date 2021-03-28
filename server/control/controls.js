const dbModel = require('../models/dbModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
  try {
    const { role, email, password, username} = req.body
    const hashedPassword = await hashPassword(password);
    const newUser = new dbModel.User({ username, email, password: hashedPassword, role: role || "basic"});
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    res.json({
      data: newUser,
      message: "You have signed up successfully"
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await dbModel.User.findOne({ email });
    if (!user) return next(new Error('Email does not exist'));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return next(new Error('Password is not correct'))
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    await dbModel.User.findByIdAndUpdate(user._id, { accessToken })
    res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken
    })
  } catch (error) {
    next(error);
  }
}

exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user)
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

exports.checkAddAccess = function(toAdd) {
  return async (req, res, next) => {
    try {
      const email = req.query.email;
      const user = await dbModel.User.findOne({ email });
      
      if (toAdd === 'Role')
      {
          if (user.role !== 'superadmin') {
            return res.status(401).json({
              error: "You don't have enough permission to perform this action"
            });
          }
          const {Level, role, Flag, Read, Update, Delete} = req.body;
          const newRole = new dbModel.Role({ Level,  role, Flag, Read, Update, Delete});
          await newRole.save();
          res.json({
            data: newRole,
            message: "New Role added successfully"
          });
      } 
      else if (toAdd === 'Image')
      {
        if (user.role !== 'superadmin' && user.role !== 'admin')
        {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action"
          });
        }
        const {Name, Size, AccessLvl} = req.body;
          const newImage = new dbModel.Image({Name, Size, AccessLvl});
          await newImage.save();
          res.json({
            data: newImage,
            message: "New Image added successfully"
          });
        
      }
    }
    catch (error) {
      next(error)
    }
    }
      
  }

  exports.updateImage = async (req, res, next) => {
    try {
      const email = req.query.email;
      const user = await dbModel.User.findOne({ email });
      const role = user.role;
      const userRole = await dbModel.Role.findOne({ role });
      
      if (userRole.Update === true)
      {
        const {Name, Size, AccessLvl} = req.body;
        await dbModel.Image.findOneAndUpdate(
        { Name: Name},
        {
          $set: {
            Size: Size,
            AccessLvl: AccessLvl
          }
        })

        const updatedImage = await dbModel.Image.findOne ({ Name });
        res.status(200).json({
          data: updatedImage,
          message: "Image updated successfully"
        });
      }
      else
      {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
    } catch (error) {
      next(error)
    }
  }

  exports.deleteImage = async (req, res, next) => {
    try {
      const email = req.query.email;
      const user = await dbModel.User.findOne({ email });
      const role = user.role;
      const userRole = await dbModel.Role.findOne({ role });
      if (userRole.Delete === true)
      {
        const {Name} = req.body;
        await dbModel.Image.remove({Name:Name})
        res.status(200).json({
          message: "Image deleted"
        });
      }
      else
      {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
    } catch (error) {
      next(error)
    }
  }

  exports.getImages = async (req, res, next) => {
    try {
      const email = req.query.email;
      const user = await dbModel.User.findOne({ email });
      const role = user.role;
      const userRole = await dbModel.Role.findOne({ role });
      if (userRole.Read === true)
      {
        if (userRole.Flag === true)
        {
          const data = await dbModel.Image.find({'AccessLvl': userRole.Level});
          res.status(200).json({
            data: data
          });
        }
        else
        {
          const data = await dbModel.Image.find({'AccessLvl':{$lte:userRole.Level}}); // $lte: less than or equal to
          res.status(200).json({
            data: data
          })
        }
      }
      else
      {
        return res.status(401).json({
          error: "You don't have enough permission to perform this action"
        });
      }
    } catch (error) {
      next(error)
    }
  }
