import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Modal, Alert } from "react-native";
import { WebSocketContext } from "./WebSocketContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const EnvironmentSettings = () => {
  const [selectedPreset, setSelectedPreset] = useState("null");
  const [customPresets, setCustomPresets] = useState([]);
  const [cropData, setCropData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPreset, setNewPreset] = useState({
    name: "",
    tempRange: { max: 0, min: 0 },
    humidityRange: { max: 0, min: 0 },
    soilMoistureRange: { max: 0, min: 0 },
  });
  const { ws } = useContext(WebSocketContext);

  useEffect(() => {
    if (ws) {
        // 앱이 시작될 때 모든 작물 데이터를 요청
        const message = JSON.stringify({ type: "getAllCropData" });
        
        // WebSocket 연결 여부 확인
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
            console.log('Requested all crop data from server:', message);
        } else {
            Alert.alert("연결 오류", "서버와의 연결이 열려 있지 않습니다. 앱을 다시 실행하거나 서버 연결을 확인하세요.");
        }

        // 서버로부터의 메시지 처리
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'cropData') {
                    setCropData(data.cropConditions);
                } else if (data.type === 'allCropData') {
                    const receivedCustomPresets = data.allCropConditions.map((crop) => ({
                        name: crop.crop_name,
                        tempRange: { max: crop.temp_max, min: crop.temp_min },
                        humidityRange: { max: crop.humidity_max, min: crop.humidity_min },
                        soilMoistureRange: { max: crop.soil_moisture_max, min: crop.soil_moisture_min },
                    }));
                    setCustomPresets(receivedCustomPresets);
                    console.log('Received all crop data from server:', receivedCustomPresets);
                } else if (data.type === 'sensorData') {
                    setCropData(prevCropData => ({
                        ...prevCropData,
                        led_status: data.sensorData.led_status,
                        fan_status: data.sensorData.fan_status,
                        servo_motor_angle: data.sensorData.servo_motor_angle,
                    }));
                    console.log('Received real-time sensor data from server:', data.sensorData);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error occurred:", error);
            Alert.alert("연결 오류", "서버와의 연결 중 오류가 발생했습니다. 네트워크 상태를 확인하세요.");
        };

        ws.onclose = (event) => {
            console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
            Alert.alert("연결 종료", "서버와의 연결이 종료되었습니다. 다시 시도해 주세요.");
        };
    }
}, [ws]);

  const handlePresetSelect = (crop) => {
    setSelectedPreset(crop);

    const selectedCustomPreset = customPresets.find((preset) => preset.name === crop);
    if (selectedCustomPreset) {
      setCropData({
        crop_name: selectedCustomPreset.name,
        temp_max: selectedCustomPreset.tempRange.max,
        temp_min: selectedCustomPreset.tempRange.min,
        humidity_max: selectedCustomPreset.humidityRange.max,
        humidity_min: selectedCustomPreset.humidityRange.min,
        soil_moisture_max: selectedCustomPreset.soilMoistureRange.max,
        soil_moisture_min: selectedCustomPreset.soilMoistureRange.min,
      });
    }
  };

  const handleApplyPreset = () => {
    if (cropData) {
        Alert.alert("적용 되었습니다", `${cropData.crop_name} 설정이 적용되었습니다.`);
        if (ws && ws.readyState === WebSocket.OPEN) {
            const message = JSON.stringify({ type: "selectCropData", cropName: cropData.crop_name });
            ws.send(message);
            console.log(`Sent crop data to server: ${message}`);
        } else {
            Alert.alert("연결 오류", "서버와의 연결이 열려 있지 않습니다. 설정을 적용할 수 없습니다.");
            console.error("WebSocket이 연결되지 않았습니다.");
        }
    } else {
        Alert.alert("오류", "적용할 설정이 없습니다.");
    }
};

  const handleDeletePreset = () => {
    if (selectedPreset) {
      Alert.alert(
        "설정 삭제 확인",
        `${selectedPreset} 설정을 삭제하시겠습니까?`,
        [
          {
            text: "취소",
            style: "cancel",
          },
          {
            text: "삭제",
            onPress: () => {
              const updatedPresets = customPresets.filter(preset => preset.name !== selectedPreset);
              setCustomPresets(updatedPresets);
              setSelectedPreset(null);
              setCropData(null);
              Alert.alert("삭제 되었습니다", `${selectedPreset} 설정이 삭제되었습니다.`);
  
              // 삭제한 프리셋 정보를 WebSocket을 통해 서버로 전송
              if (ws && ws.readyState === WebSocket.OPEN) {
                const message = JSON.stringify({ type: "deleteCropPreset", cropName: selectedPreset });
                ws.send(message);
                console.log(`Sent delete preset data to server: ${message}`);
              } else {
                console.error("WebSocket이 연결되지 않았습니다.");
              }
            },
          },
        ]
      );
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>환경 제어</Text>

      <View style={styles.presetContainer}>
        {customPresets.map((preset) => (
          <Pressable
            key={preset.name}
            style={[
              styles.presetButton,
              selectedPreset === preset.name && styles.selectedButton,
            ]}
            onPress={() => handlePresetSelect(preset.name)}
          >
            <Text style={styles.presetButtonText}>{preset.name}</Text>
          </Pressable>
        ))}

        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>

      </View>

      {cropData && (
        <View style={styles.cropDataCard}>
          <Text style={styles.cropName}>{cropData.crop_name}</Text>
          <View style={styles.separator} />
          <View style={styles.cropDataRow}>
            <MaterialCommunityIcons name="thermometer" size={30} color="#FF5722" />
            <Text style={styles.cropDataText}>최고기온: {cropData.temp_max}°C</Text>
          </View>
          <View style={styles.cropDataRow}>
            <MaterialCommunityIcons name="thermometer-low" size={30} color="#2196F3" />
            <Text style={styles.cropDataText}>최저기온: {cropData.temp_min}°C</Text>
          </View>
          <View style={styles.cropDataRow}>
            <MaterialCommunityIcons name="water-percent" size={30} color="#00BCD4" />
            <Text style={styles.cropDataText}>최고습도: {cropData.humidity_max}%</Text>
          </View>
          <View style={styles.cropDataRow}>
            <MaterialCommunityIcons name="water-outline" size={30} color="#03A9F4" />
            <Text style={styles.cropDataText}>최저습도: {cropData.humidity_min}%</Text>
          </View>
          <View style={styles.cropDataRow}>
            <MaterialCommunityIcons name="flower" size={30} color="#FFC107" />
            <Text style={styles.cropDataText}>최고토양습도: {cropData.soil_moisture_max}</Text>
          </View>
          <View style={styles.cropDataRow}>
            <MaterialCommunityIcons name="flower-outline" size={30} color="#FF9800" />
            <Text style={styles.cropDataText}>최저토양습도: {cropData.soil_moisture_min}</Text>
          </View>
          <Pressable style={styles.applyButton} onPress={handleApplyPreset}>
            <Text style={styles.applyButtonText}>적용</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={handleDeletePreset}>
            <Text style={styles.deleteButtonText}>삭제</Text>
          </Pressable>
        </View>
      )}

<Modal visible={modalVisible} animationType="slide">
  <View style={styles.modalContainer}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.modalHeader}>프리셋 추가</Text>
      
      <Text style={styles.label}>프리셋 이름</Text>
      <TextInput
        style={styles.input}
        placeholder="프리셋 이름"
        value={newPreset.name}
        onChangeText={(text) => setNewPreset({ ...newPreset, name: text })}
      />
      
      <Text style={styles.label}>최고기온 (°C)</Text>
      <TextInput
        style={styles.input}
        placeholder="최고기온 (예: 25)"
        keyboardType="numeric"
        value={newPreset.tempRange.max.toString()}
        onChangeText={(text) => setNewPreset({ ...newPreset, tempRange: { ...newPreset.tempRange, max: parseInt(text) || 0 } })}
      />
      
      <Text style={styles.label}>최저기온 (°C)</Text>
      <TextInput
        style={styles.input}
        placeholder="최저기온 (예: 15)"
        keyboardType="numeric"
        value={newPreset.tempRange.min.toString()}
        onChangeText={(text) => setNewPreset({ ...newPreset, tempRange: { ...newPreset.tempRange, min: parseInt(text) || 0 } })}
      />
      
      <Text style={styles.label}>최고습도 (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="최고습도 (예: 70)"
        keyboardType="numeric"
        value={newPreset.humidityRange.max.toString()}
        onChangeText={(text) => setNewPreset({ ...newPreset, humidityRange: { ...newPreset.humidityRange, max: parseInt(text) || 0 } })}
      />
      
      <Text style={styles.label}>최저습도 (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="최저습도 (예: 50)"
        keyboardType="numeric"
        value={newPreset.humidityRange.min.toString()}
        onChangeText={(text) => setNewPreset({ ...newPreset, humidityRange: { ...newPreset.humidityRange, min: parseInt(text) || 0 } })}
      />
      
      <Text style={styles.label}>최고토양습도 (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="최고토양습도 (예: 50)"
        keyboardType="numeric"
        value={newPreset.soilMoistureRange.max.toString()}
        onChangeText={(text) => setNewPreset({ ...newPreset, soilMoistureRange: { ...newPreset.soilMoistureRange, max: parseInt(text) || 0 } })}
      />
      
      <Text style={styles.label}>최저토양습도 (%)</Text>
      <TextInput
        style={styles.input}
        placeholder="최저토양습도 (예: 30)"
        keyboardType="numeric"
        value={newPreset.soilMoistureRange.min.toString()}
        onChangeText={(text) => setNewPreset({ ...newPreset, soilMoistureRange: { ...newPreset.soilMoistureRange, min: parseInt(text) || 0 } })}
      />

      <Pressable style={styles.saveButton} onPress={() => {
        setCustomPresets([...customPresets, newPreset]);

        // 새로운 프리셋 추가 후 WebSocket을 통해 서버로 전송
        if (ws && ws.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({
            type: "addCropPreset",
            cropData: {
              crop_name: newPreset.name,
              temp_max: newPreset.tempRange.max,
              temp_min: newPreset.tempRange.min,
              humidity_max: newPreset.humidityRange.max,
              humidity_min: newPreset.humidityRange.min,
              soil_moisture_max: newPreset.soilMoistureRange.max,
              soil_moisture_min: newPreset.soilMoistureRange.min,
            }
          });
          ws.send(message);
          console.log(`Sent new preset data to server: ${message}`);
        } else {
          console.error("WebSocket이 연결되지 않았습니다.");
        }

        setModalVisible(false);
        setNewPreset({
          name: "",
          tempRange: { max: 0, min: 0 },
          humidityRange: { max: 0, min: 0 },
          soilMoistureRange: { max: 0, min: 0 },
        });
      }}>
        <Text style={styles.saveButtonText}>저장</Text>
      </Pressable>
      <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>닫기</Text>
      </Pressable>
    </ScrollView>
  </View>
</Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  presetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  presetButton: {
    flexBasis: "30%", // 버튼이 화면 너비의 30%를 차지하도록 설정
    padding: 15,
    backgroundColor: "#8BC34A",
    borderRadius: 12,
    marginVertical: 5,
    alignItems: "center",
    elevation: 5,
  },
  selectedButton: {
    backgroundColor: "#689F38",
    borderWidth: 2,
    borderColor: "#333",
  },
  presetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    flexBasis: "30%", // "+" 버튼도 같은 비율로 설정
    padding: 15,
    backgroundColor: "#FF5722",
    borderRadius: 12,
    marginVertical: 5,
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  cropDataCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  cropName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 15,
  },
  cropDataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  cropDataText: {
    fontSize: 22,
    color: "#333",
    marginLeft: 15,
  },
  applyButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  modalHeader: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default EnvironmentSettings;
