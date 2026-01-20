import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import { User } from './User';

export class Pet extends Model {
    declare id: number;
    declare name: string;
    declare characteristics: string;
    declare description: string;
    declare status: 'lost' | 'found';
    declare location: string;
    declare lat: number;
    declare lng: number;
    declare imageUrl: string;
    declare userId: number;
}

Pet.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    characteristics: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('lost', 'found'),
        defaultValue: 'lost'
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
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Pet',
    tableName: 'pets'
});

Pet.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
User.hasMany(Pet, { foreignKey: 'userId', as: 'pets' });
