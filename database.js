const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('library.db');

db.serialize(() => {
  // Crea la tabla libros
  db.run('CREATE TABLE IF NOT EXISTS libros (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, autor TEXT, anioPublicacion INTEGER, editorial TEXT, genero TEXT, idioma TEXT)');

  // Crear la tabla de reseñas
  db.run('CREATE TABLE IF NOT EXISTS resenas (id INTEGER PRIMARY KEY AUTOINCREMENT, libro_id INTEGER, texto TEXT, FOREIGN KEY (libro_id) REFERENCES libros(id))');
});

db.run('PRAGMA foreign_keys=ON');  // Habilitar soporte para claves foráneas

module.exports = db;
