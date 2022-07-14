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
    // token: {
    //   field: "Id_Token",
    //   type: DataType.STRING,
    //   allowNull: false,
    // },
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

//   Notification.belongsTo(User,{
//     foreignKey: 'User_Id',
//     as: 'user' 
//   });

//   Notification.associate = (models) => {
//     Notification.belongsTo(models.User, {
//       foreignKey:{
//         field: 'User_Id',
//         allowNull: false
//       }
//     });
//   };
  return Notification;
};
