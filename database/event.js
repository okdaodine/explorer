import Sequelize from 'sequelize';
import sequelizeConnect from './index';

const sequelize = sequelizeConnect();
const Event = sequelize.define('events', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  blockchain: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  block: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  transaction: {
    type: Sequelize.STRING,
  },
  sort_key: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  time: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  effect: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  failed: {
    type: Sequelize.BOOLEAN,
  },
  extra: {
    type: Sequelize.STRING,
  },
  extra_indexed: {
    type: Sequelize.STRING,
  },
}, {
  tableName: 'events',
  charset: 'utf8mb4',
  timestamps: false,
  indexes: [{
    fields: ['blockchain']
  }, {
    fields: ['id']
  }, {
    fields: ['block']
  }, {
    fields: ['transaction']
  }, {
    fields: ['sort_key']
  }, {
    fields: ['address']
  }, {
    fields: ['extra_indexed']
  }]
});

Event.sync();

export default Event;