// // WebSocketComponent.js
// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';

// const WebSocketComponent = () => {
//   const [sensorData, setSensorData] = useState([]);

//   useEffect(() => {
//     const ws = new WebSocket('ws://192.168.0.100:8080');  // 라즈베리 파이의 IP 주소

//     ws.onopen = () => {
//       console.log('Connected to WebSocket server');
//     };

//     ws.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       setSensorData(data);  // 받은 데이터를 상태에 저장
//     };

//     ws.onerror = (error) => {
//       console.log('WebSocket error:', error.message);
//     };

//     ws.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <View>
//       <Text>Sensor Data:</Text>
//       {sensorData.map((sensor, index) => (
//         <Text key={index}>{`ID: ${sensor.id}, Value: ${sensor.light_sensor_value}`}</Text>
//       ))}
//     </View>
//   );
// };

// export default WebSocketComponent;
