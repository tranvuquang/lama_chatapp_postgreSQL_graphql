module.exports = (sequelize: any, DataTypes: any) => {
  const conversations = sequelize.define("conversations", {
    id: {
      allowNull: false,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    members: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
    },
  });

  conversations.associate = (models: any) => {
    conversations.hasMany(models.users, {
      onDelete: "cascade",
      foreignKey: "id", 
    });
  };

  return conversations;
};
