const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar veículos
router.get('/', (req, res) => {
  db.query('SELECT * FROM Veiculos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Criar veículo
router.post('/', (req, res) => {
  const { marca, modelo, ano, placa, preco_diario } = req.body;
  db.query('INSERT INTO Veiculos SET ?', { marca, modelo, ano, placa, preco_diario }, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
});

// Editar veículo
router.put('/:id', (req, res) => {
  db.query('UPDATE Veiculos SET ? WHERE veiculo_id = ?', [req.body, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

// Excluir veículo
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Veiculos WHERE veiculo_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;