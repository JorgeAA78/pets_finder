import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class User extends Model {
    declare id: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare location: string;
    declare lat: number;
    declare lng: number;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lat: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    lng: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
});
