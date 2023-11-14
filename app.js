const express = require('express');
const db = require('./database'); // Importa el módulo de la base de datos
const app = express();
const port = 3000;

app.use(express.json());

// Listar libros
app.get('/libros', (req, res) => {
  const genero = req.query.genero;

  if (genero) {
    // Listar libros por género
    db.all('SELECT * FROM libros WHERE genero = ?', [genero], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(404).json({ error: 'No se encontraron libros del género especificado' });
      }
    });
  } else {
    // Listar todos los libros si no se proporciona un parámetro de género
    db.all('SELECT * FROM libros', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  }
});

// Endpoint para obtener un libro por ID
app.get('/libros/:id', (req, res) => {
  const id = req.params.id;

  // Realiza una consulta SQL para obtener el libro por ID
  db.get('SELECT * FROM libros WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!row) {
      res.status(404).json({ message: 'Libro no encontrado' });
      return;
    }

    res.json(row);
  });
});

// Endpoint para crear un nuevo libro
app.post('/libros', (req, res) => {
  const { titulo, autor, anioPublicacion, editorial, genero, idioma } = req.body;

  // Validar el año de publicación
  if (isNaN(anioPublicacion) || anioPublicacion < 0 || !Number.isInteger(anioPublicacion)) {
    return res.status(400).json({ message: 'El año de publicación debe ser un número entero positivo.' });
  }

  // Insertar el nuevo libro en la base de datos con los campos adicionales
  const sql = 'INSERT INTO libros (titulo, autor, anioPublicacion, editorial, genero, idioma) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [titulo, autor, anioPublicacion, editorial, genero, idioma], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Libro creado' });
  });
});

// Endpoint para actualizar un libro por ID
app.put('/libros/:id', (req, res) => {
  const id = req.params.id;
  const { titulo, autor, anioPublicacion, editorial, genero, idioma } = req.body;

  // Validar el año de publicación
  if (isNaN(anioPublicacion) || anioPublicacion < 0 || !Number.isInteger(anioPublicacion)) {
    return res.status(400).json({ message: 'El año de publicación debe ser un número entero positivo.' });
  }
  
  // Actualizar el libro en la base de datos con los campos adicionales
  const sql = 'UPDATE libros SET titulo = ?, autor = ?, anioPublicacion = ?, editorial = ?, genero = ?, idioma = ? WHERE id = ?';
  db.run(sql, [titulo, autor, anioPublicacion, editorial, genero, idioma, id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Libro actualizado' });
  });
});

// Endpoint para eliminar un libro por ID
app.delete('/libros/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM libros WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Libro eliminado' });
  });
});

// En este caso se consire el recurso reseñas
// Endpoint para obtener las reseñas de un libro específico
app.get('/libros/:id/resenas', (req, res) => {
  const libroId = req.params.id;

  // Realiza una consulta SQL para obtener las reseñas del libro por su ID
  db.all('SELECT * FROM resenas WHERE libro_id = ?', [libroId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// Endpoint para crear una nueva reseña para un libro específico
app.post('/libros/:id/resenas', (req, res) => {
  const libroId = req.params.id;
  const { texto } = req.body;

  // Inserta la nueva reseña en la base de datos
  const sql = 'INSERT INTO resenas (libro_id, texto) VALUES (?, ?)';
  db.run(sql, [libroId, texto], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Reseña creada', resena_id: this.lastID });
  });
});


app.listen(port, () => {
  console.log(`La API está escuchando en http://localhost:${port}`);
});
