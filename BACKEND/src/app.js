const path = require('path');
const express = require('express');

const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const frontendPath = path.join(__dirname, '..', '..', 'FRONTEND');

app.use(express.json());
app.use(express.static(frontendPath, { index: false }));

app.use('/api', apiRoutes);

app.get('/', (_req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
app.get('/app', (_req, res) => res.sendFile(path.join(frontendPath, 'app.html')));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
