import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { WebSocketContext } from './WebSocketContext';

// 아이콘용 예시
const icons = {
  temperature: '🌡️',
  humidity: '💧',
  soilMoisture: '🌱',
  lightSensor: '🔆',
  solarSensor: '☀️',
  servoMotor: '⚙️',
  ledStatus: '💡',
  fanStatus: '🌀',
};

// Live 컴포넌트
const Live = () => {
  const { ws } = useContext(WebSocketContext);
  const [sensorData, setSensorData] = useState(null);


  // 상태 초기화
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [lightSensorValue, setLightSensorValue] = useState(0);
  const [solarSensorValue, setSolarSensorValue] = useState(0);
  const [servoMotorAngle, setServoMotorAngle] = useState(0);
  const [ledStatus, setLedStatus] = useState('꺼짐');
  const [fanStatus, setFanStatus] = useState('꺼짐');

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'sensorData' && data.sensorData) {
            setSensorData(data.sensorData);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    }
  }, [ws]);

  useEffect(() => {
    if (sensorData) {
      // 센서 데이터를 받아 상태 업데이트
      setTemperature(parseFloat(sensorData.temperature).toFixed(1) || 0);
      setHumidity(parseFloat(sensorData.humidity).toFixed(1) || 0);
      setSoilMoisture(parseFloat(sensorData.soil_moisture).toFixed(1) || 0);
      setLightSensorValue(parseFloat(sensorData.light_sensor_value).toFixed(1) || 0);
      setSolarSensorValue(parseFloat(sensorData.solar_sensor_value).toFixed(1) || 0);
      setServoMotorAngle(sensorData.servo_motor_angle || 0);
      setLedStatus(sensorData.led_status ? '켜짐' : '꺼짐');
      setFanStatus(sensorData.fan_status ? '켜짐' : '꺼짐');
    }
  }, [sensorData]);

  return (
    <ScrollView style={styles.container}>
      {/* 실시간 정보 제목 */}
      <Text style={styles.title}>실시간 정보</Text>

      {/* 센서 데이터 카드 */}
      <SensorCard icon={icons.temperature} label="온도" value={`${temperature}℃`} color="#FFEBEE" />
      <SensorCard icon={icons.humidity} label="습도" value={`${humidity}%`} color="#E8F5E9" />
      <SensorCard icon={icons.soilMoisture} label="토양 수분" value={`${soilMoisture}%`} color="#FFF3E0" />
      <SensorCard icon={icons.lightSensor} label="조도 센서 값" value={`${lightSensorValue} lux`} color="#E3F2FD" />
      <SensorCard icon={icons.solarSensor} label="태양열 충천 값" value={`${solarSensorValue} lux`} color="#FFFDE7" />
      <SensorCard icon={icons.servoMotor} label="서보 모터 각도" value={`${servoMotorAngle}°`} color="#F3E5F5" />
      <SensorCard icon={icons.ledStatus} label="LED 상태" value={ledStatus} color="#E1F5FE" />
      <SensorCard icon={icons.fanStatus} label="팬 상태" value={fanStatus} color="#E0F7FA" />
    </ScrollView>
  );
};

const SensorCard = ({ icon, label, value, color }) => (
  <View style={[styles.sensorCard, { backgroundColor: color }]}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sensorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 50,
    marginRight: 15,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
  },
  label: {
    fontSize: 20,
    color: '#555',
    marginBottom: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    paddingTop: 40, // 상단 공백 추가
},

});

export default Live;
