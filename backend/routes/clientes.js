const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar clientes
router.get('/', (req, res) => {
  db.query('SELECT * FROM Clientes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Criar cliente
router.post('/', (req, res) => {
  const { nome, email, telefone, data_nascimento, endereco } = req.body;
  db.query('INSERT INTO Clientes SET ?', { nome, email, telefone, data_nascimento, endereco }, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
});

// Editar cliente 
router.put('/:id', (req, res) => {
  db.query('UPDATE Clientes SET ? WHERE cliente_id = ?', [req.body, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

// Excluir cliente 
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Clientes WHERE cliente_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;