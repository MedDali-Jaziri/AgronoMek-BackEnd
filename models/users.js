const bcrypt = require("bcrypt");
const Notification = require('../models/notifications.js')

module.exports = (sequelize, DataType) => {
  const User = sequelize.define("user", {
    id: {
      field: "Id_User",
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      field: "Name_User",
      type: DataType.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0, 50],
          msg: "The name has too many characters",
        },
      },
    },
    email: {
      field: "Email_User",
      type: DataType.STRING,
      unique: {
        args: true,
        msg: "Email must be unique",
      },
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email format",
        },
        notEmpty: {
          args: true,
          msg: "Cannot be blank",
        },
      },
    },
    password: {
      field: "Password_User",
      type: DataType.STRING,
      allowNull: false,
      set(value) {
        // const hash = bcrypt.hashSync(value, 10);
        this.setDataValue("password", value);
      },
    },
    image: {
      field: "Image_User",
      type: DataType.BLOB("long"),
      allowNull: false,
    },
    country: {
      field: "Country_User",
      type: DataType.STRING,
      allowNull: false,
    },
  },
//   {
//     freezeTableName: true,
//     instanceMethods: {
//         generateHash(password) {
//             return bcrypt.hash(password, bcrypt.genSaltSync(8));
//         },
//         validPassword(password) {
//             return bcrypt.compare(password, this.password);
//         }
//     }
//   }
  );

  return User;
};
