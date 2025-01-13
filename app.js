
const express = require('express');
const session = require('express-session');

const app = express();
// se define el puerto 
const PORT = 3000;

// Configura el middleware para manejar sesiones usando 'express-session'.
app.use(session({
    secret: 'ArrozConHuevo',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Configura la cookie de sesión. 'secure: false' indica que la cookie no necesita HTTPS (cambiar a 'true' si usas HTTPS).
}));

// Middleware para gestionar la fecha de creación y el último acceso de la sesión.
app.use((req, res, next) => {
    
    if (!req.session.createdAt) {
        req.session.createdAt = new Date();
    }
    // Registra la fecha y hora del último acceso.
  
    next();
});

// Ruta para mostrar los detalles de la sesión.
app.get('/session', (req, res) => {
    // Verifica si existe una sesión activa.
    if (req.session) {
        // Extrae los datos de la sesión.
        const sessionId = req.session.id;
        const user = req.session.user;
        const createdAt = req.session.createdAt;
        const lastAccess = req.session.lastAccess;
        // Calcula la duración de la sesión en segundos.
        const sessionDuration = (new Date() - new Date(createdAt)) / 1000;

        // Responde con una página HTML mostrando los detalles de la sesión.
        res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Detalles de la sesión</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
    
                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
    
                h1 {
                    text-align: center;
                    color: #4CAF50;
                }
    
                p {
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 12px;
                }
    
                p strong {
                    color: #555;
                }
    
                .details {
                    padding: 15px;
                    background-color: #f9f9f9;
                    border-radius: 6px;
                    border: 1px solid #ddd;
                }
    
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Detalles de la sesión</h1>
                <div class="details">
                    <p><strong>ID de sesión:</strong> ${sessionId}</p>
                    <p><strong>Usuario:</strong> ${user}</p>
                    <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
                    <p><strong>Último acceso:</strong> ${lastAccess}</p>
                    <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
                </div>
            </div>
        </body>
        </html>
    `);
    
    } else {
        // Si no hay sesión, responde con un mensaje que indique que la sesión fue cerrada exitosamente.
        res.send(`<h1>Sesión cerrada exitosamente.</h1>`);
    }
});

// Ruta para destruir la sesión y cerrarla.
app.get('/logout', (req, res) => {
    // Destruye la sesión de usuario.
    req.session.destroy(err => {
       
        if (err) {
            return res.status(500).send('Error al destruir la sesión');
        }
       
        res.send('Sesión destruida');
    });
});


app.listen(PORT, () => {
    console.log(`Servidor esta encendido en el puerto ${PORT}`);
});
