import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WebSocketContext } from './WebSocketContext';
import moment from 'moment';

// Graph 컴포넌트
export default function Graph() {
  const { ws } = useContext(WebSocketContext);
  const [temperature, setTemperature] = useState([0]);
  const [humidity, setHumidity] = useState([0]);
  const [soilMoisture, setSoilMoisture] = useState([0]);
  const [lightSensorValue, setLightSensorValue] = useState([0]);
  const [solarSensorValue, setSolarSensorValue] = useState([0]);
  const [timestamps, setTimestamps] = useState([]);

  const { width } = useWindowDimensions(); // 창 크기에 따라 너비 자동 조정

  const sanitizeData = (data) => {
    return data.map(value => (isNaN(value) || !isFinite(value) ? 0 : value));
  };

  const aggregateDataByDay = (data) => {
    const aggregated = {};
    data.forEach((item) => {
      const date = moment(item.timestamp).format('YYYY-MM-DD'); // 날짜만 추출
      if (!aggregated[date]) {
        aggregated[date] = { ...item, count: 1 };
      } else {
        aggregated[date].temperature += item.temperature;
        aggregated[date].humidity += item.humidity;
        aggregated[date].soilMoisture += item.soilMoisture;
        aggregated[date].lightSensorValue += item.lightSensorValue;
        aggregated[date].solarSensorValue += item.solarSensorValue;
        aggregated[date].count += 1;
      }
    });
    return Object.values(aggregated).map((item) => ({
      temperature: item.temperature / item.count,
      humidity: item.humidity / item.count,
      soilMoisture: item.soilMoisture / item.count,
      lightSensorValue: item.lightSensorValue / item.count,
      solarSensorValue: item.solarSensorValue / item.count,
      timestamp: item.timestamp.split('T')[0],
    }));
  };

  useEffect(() => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'getAllSensorData' }));

      const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'allSensorData') {
            const allSensorData = data.allSensorData;
            console.log("allSensorData: ", allSensorData);

            const validatedData = allSensorData
              .filter(item => item.timestamp)  // timestamp가 존재하는 항목만 필터링
              .map((item) => ({
                timestamp: item.timestamp,
                temperature: parseFloat(item.temperature),
                humidity: parseFloat(item.humidity),
                soilMoisture: parseFloat(item.soil_moisture),
                lightSensorValue: parseFloat(item.light_sensor_value),
                solarSensorValue: parseFloat(item.solar_sensor_value),
              }))
              .filter(item =>  // 모든 데이터 값이 유효한 숫자인지 확인
                !isNaN(item.temperature) &&
                !isNaN(item.humidity) &&
                !isNaN(item.soilMoisture) &&
                !isNaN(item.lightSensorValue) &&
                !isNaN(item.solarSensorValue) &&
                isFinite(item.temperature) &&
                isFinite(item.humidity) &&
                isFinite(item.soilMoisture) &&
                isFinite(item.lightSensorValue) &&
                isFinite(item.solarSensorValue)
            );

            const dailyData = aggregateDataByDay(validatedData);

            setTimestamps(dailyData.map((item) => moment(item.timestamp).format('MM-DD')));
            setTemperature(dailyData.map((item) => item.temperature.toFixed(1)));
            setHumidity(dailyData.map((item) => item.humidity.toFixed(1)));
            setSoilMoisture(dailyData.map((item) => item.soilMoisture.toFixed(1)));
            setLightSensorValue(dailyData.map((item) => item.lightSensorValue.toFixed(1)));
            setSolarSensorValue(dailyData.map((item) => item.solarSensorValue.toFixed(1)));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.addEventListener('message', handleMessage);

      return () => {
        ws.removeEventListener('message', handleMessage);
      };
    } else {
      console.error('WebSocket is not open or is null');
    }
  }, [ws]);

  const renderChart = (title, data, chartColor) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <LineChart
        data={{
          labels: timestamps.map((timestamp) => String(timestamp)), // 문자열 배열로 변환
          datasets: [{ data: sanitizeData(data), color: () => chartColor }],
        }}
        width={width - 40}
        height={220}
        chartConfig={{
          ...chartConfig,
          color: (opacity = 1) => chartColor,
        }}
        style={styles.chart}
        bezier // 부드러운 곡선 라인
        withDots={false} // 점 표시 제거
      />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>센서 데이터 그래프</Text>
      {renderChart('온도 변화 그래프', temperature, 'rgba(255, 99, 132, 1)')}
      {renderChart('습도 변화 그래프', humidity, 'rgba(54, 162, 235, 1)')}
      {renderChart('토양 수분 변화 그래프', soilMoisture, 'rgba(75, 192, 192, 1)')}
      {renderChart('조도 센서 값 변화 그래프', lightSensorValue, 'rgba(255, 206, 86, 1)')}
      {renderChart('태양열 센서 충전량 변화 그래프', solarSensorValue, 'rgba(153, 102, 255, 1)')}
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // 차트 색상
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 라벨 색상
  strokeWidth: 2,
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: '100%',
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 16,
  },
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 40, // 상단 공백 추가
},

});