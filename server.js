const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de SQL Server
const dbConfig = {
    user: 'sa', // Cambiar por tu usuario
    password: 'M1mp$.21%%', // Cambiar por tu contraseña
    server: 'localhost',
    database: 'Cuestionario',
    options: {
        encrypt: true, // Cambiar a true si usas Azure
        enableArithAbort: true
    }
};

// Endpoint para guardar respuestas
app.post('/guardar', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const { genero, edad, grado, fecha, edadLlegada, edadActual, actividades, planTrabajo, buzon } = req.body;

        await pool.request()
            .input('Genero', sql.NVarChar, genero)
            .input('Edad', sql.Int, edad)
            .input('Grado', sql.NVarChar, grado)
            .input('Fecha', sql.Date, fecha)
            .input('EdadLlegada', sql.Int, edadLlegada)
            .input('EdadActual', sql.Int, edadActual)
            .input('Actividades', sql.NVarChar, actividades)
            .input('PlanTrabajoIndividual', sql.Bit, planTrabajo)
            .input('Buzon', sql.Bit, buzon)
            .query(`
                INSERT INTO Respuestas (Genero, Edad, Grado, Fecha, EdadLlegada, EdadActual, Actividades, PlanTrabajoIndividual, Buzon)
                VALUES (@Genero, @Edad, @Grado, @Fecha, @EdadLlegada, @EdadActual, @Actividades, @PlanTrabajoIndividual, @Buzon)
            `);

        res.send('Datos guardados correctamente.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al guardar los datos.');
    }
});

// Endpoint para obtener datos
app.get('/datos', async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Respuestas');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los datos.');
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
