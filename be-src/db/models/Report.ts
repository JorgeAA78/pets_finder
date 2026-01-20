import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import { Pet } from './Pet';

export class Report extends Model {
    declare id: number;
    declare petId: number;
    declare reporterName: string;
    declare reporterPhone: string;
    declare location: string;
    declare lat: number;
    declare lng: number;
    declare message: string;
}

Report.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    petId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pet,
            key: 'id'
        }
    },
    reporterName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reporterPhone: {
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
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Report',
    tableName: 'reports'
});

Report.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });
Pet.hasMany(Report, { foreignKey: 'petId', as: 'reports' });
