module.exports = (sequelize: any, DataTypes: any) => {
  const messages = sequelize.define("messages", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sender: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return messages;
};
