const User = require('../models/users.js')

module.exports = (sequelize, DataType) => {
  const Notification = sequelize.define("notification", {
    id: {
      field: "Id_Notification",
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    verify: {
      field: "Verify_Value",
      type: DataType.BOOLEAN,
      defaultValue: false,
    },
    message: {
        field: "Message_Notification",
        type: DataType.STRING,
        allowNull: false,
      },
  });
  return Notification;
};
