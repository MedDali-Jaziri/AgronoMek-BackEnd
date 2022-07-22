const User = require('../models/users.js')

module.exports = (sequelize, DataType) => {
  const GreenHouse = sequelize.define("greenhouse", {
    id: {
      field: "Id_GreenHouse",
      type: DataType.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nameGreenHouse: {
        field: "Name_GreenHouse",
        type: DataType.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [0, 50],
            msg: "The name has too many characters",
          },
        },
      },
  });

  return GreenHouse;
};
