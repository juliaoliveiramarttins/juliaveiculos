const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar locações
router.get('/', (req, res) => {
  db.query('SELECT * FROM Locacoes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Criar locação
router.post('/', (req, res) => {
  const { cliente_id, veiculo_id, data_inicio, data_fim, valor } = req.body;
  db.query('INSERT INTO Locacoes SET ?', { cliente_id, veiculo_id, data_inicio, data_fim, valor }, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
});

// Editar locação
router.put('/:id', (req, res) => {
  db.query('UPDATE Locacoes SET ? WHERE locacao_id = ?', [req.body, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

// Cancelar locação
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Locacoes WHERE locacao_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

module.exports = router;