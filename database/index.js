import { Sequelize } from 'sequelize';
import nextConfig from 'next.config';

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  dialectOptions: (process.env.DB_HOST || '').includes('.com') ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {},
  ...(nextConfig.sequelize || {}),
  logging: () => {},
});

const sequelizeConnect = () => {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully.');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
      process.exit(0);
    }
  })();
  return sequelize;
}

export default sequelizeConnect;
