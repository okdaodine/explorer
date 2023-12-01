import Sequelize from 'sequelize';
import sequelizeConnect from './index';

const sequelize = sequelizeConnect();
const Block = sequelize.define('blocks', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  blockchain: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  number: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  hash: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  eventCount: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  time: {
    type: Sequelize.DATE,
    allowNull: false,
  },
}, {
  tableName: 'blocks',
  charset: 'utf8mb4',
  timestamps: false,
  indexes: [{
    fields: ['blockchain']
  }, {
    fields: ['id']
  }, {
    fields: ['hash']
  }]
});

Block.sync();

export default Block;