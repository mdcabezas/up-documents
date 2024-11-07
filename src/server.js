const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configuración de CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500' // Cambia esto a la URL de tu frontend
  }));

// Tipos de archivos permitidos
const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf|\.doc|\.docx)$/i;

// Configuración de multer para guardar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrar archivos según su extensión
const fileFilter = (req, file, cb) => {
  if (allowedExtensions.test(file.originalname)) {
    cb(null, true); // Aceptar archivo
  } else {
    cb(new Error('Tipo de archivo no permitido'), false); // Rechazar archivo
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

// Endpoint para subir múltiples archivos
app.post('/upload', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No se han subido archivos.');
  }
  
  // Responder con los nombres de los archivos subidos
  const filenames = req.files.map(file => file.filename);
  res.send({ message: 'Archivos subidos exitosamente', filenames: filenames });
});

// Endpoint para descargar un archivo específico
app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);

  // Verifica si el archivo existe
  if (fs.existsSync(filepath)) {
    res.download(filepath, (err) => {
      if (err) {
        res.status(500).send('Error al descargar el archivo.');
      }
    });
  } else {
    res.status(404).send('Archivo no encontrado.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});