document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const files = document.getElementById('filesInput').files;
    const maxSize = 2 * 1024 * 1024; // Tamaño máximo de archivo en bytes (2 MB)
    const allowedExtensions = /\.(jpg|jpeg|png|pdf|doc|docx)$/i;
  
    if (files.length === 0) {
      document.getElementById('message').textContent = 'Por favor selecciona al menos un archivo.';
      return;
    }
  
    // Verificar cada archivo por tamaño y extensión
    for (let file of files) {
      if (!allowedExtensions.test(file.name)) {
        document.getElementById('message').textContent = `El archivo ${file.name} tiene un tipo no permitido.`;
        return;
      }
      if (file.size > maxSize) {
        document.getElementById('message').textContent = `El archivo ${file.name} supera el límite de 2 MB.`;
        return;
      }
    }
  
    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
  
    try {
      const response = await fetch('http://192.168.1.99:3000/upload', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
  
      if (response.ok) {
        document.getElementById('message').textContent = `Archivos subidos exitosamente: ${result.filenames.join(', ')}`;
      } else {
        document.getElementById('message').textContent = result.message || 'Error al subir los archivos.';
      }
    } catch (error) {
      document.getElementById('message').textContent = 'Error al conectar con el servidor.';
    }
  });
  