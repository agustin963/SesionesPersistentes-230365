const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Configurar la sesión
app.use(session({
    secret: 'ArrozConHuevo',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambiar a true si usas HTTPS
}));

// Middleware para gestionar la sesión
app.use((req, res, next) => {
    if (!req.session.createdAt) {
        req.session.createdAt = new Date();
    }
    req.session.lastAccess = new Date();
    next();
});

// Ruta para obtener los datos de la sesión
app.get('/session', (req, res) => {
    res.json({
        sessionId: req.session.id,
        createdAt: req.session.createdAt,
        lastAccess: req.session.lastAccess,
        sessionDuration: (new Date() - req.session.createdAt) / 1000 // Duración en segundos
    });
});

// Ruta para destruir la sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al destruir la sesión');
        }
        res.send('Sesión destruida');
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
