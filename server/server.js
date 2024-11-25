const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensorRoutes'); // sensorRoutes 가져오기

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// 센서 관련 라우트 사용
app.use('/api', sensorRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
