import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/instance";

class UserModel extends Model {
    id: any;
    name: any;
    password: any;
    phone_no: any
}

UserModel.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone_no: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    is_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    created_on: {
        type: DataTypes.DOUBLE,
        defaultValue: Date.now(),
    },
    modified_on: {
        type: DataTypes.DOUBLE,
        defaultValue: Date.now(),
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
},
    {
        sequelize,
        tableName: 'users',
        timestamps: false,
    });

sequelize.sync();
export default UserModel;
