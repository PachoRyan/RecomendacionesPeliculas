require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes');
const { sequelize } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

const start = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL conectado correctamente');
        await sequelize.sync({ alter: false });
        console.log('Modelos sincronizados');
        app.listen(PORT, () => {
            console.log('Server corriendo en http://localhost:', PORT);
        });
    } catch (error) {
        console.error('❌ Error al conectar la BD:', error.message);
        process.exit(1);
    }
};

start();
