// const express = require('express');
// const router = express.Router();
// const db = require('../db'); // 데이터베이스 연결 파일

// // 센서 데이터 저장 API
// router.post('/sensor-data', (req, res) => {
//   const { temperature, humidity, co2, ec, light } = req.body;

//   if (temperature === undefined || humidity === undefined || co2 === undefined || ec === undefined || light === undefined) {
//     return res.status(400).send('모든 센서 데이터를 입력해야 합니다.');
//   }

//   const query = 'INSERT INTO sensor_data (temperature, humidity, co2, ec, light, timestamp) VALUES (?, ?, ?, ?, ?, NOW())';
//   const values = [temperature, humidity, co2, ec, light];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error('데이터 저장 오류:', err);
//       return res.status(500).send('데이터 저장 중 오류가 발생했습니다.');
//     }

//     res.status(201).send('데이터가 성공적으로 저장되었습니다.');
//   });
// });

// module.exports = router;
