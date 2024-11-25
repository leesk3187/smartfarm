import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

const Icon = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.pressable} 
        onPress={() => {
          navigation.navigate('MainTabs', { screen: 'Home' });  // Icon 화면에서 Home 화면으로 이동
        }}
      >
        <Text style={styles.healthguard}>SmartFarm</Text>
        <Image 
          style={styles.image5Icon}
          source={require('../assets/logo.png')}
          resizeMode="contain"
        />
        <Text style={styles.instructionText}>화면을 클릭하면 홈 화면으로 넘어갑니다!</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  pressable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ffffff",
    borderRadius: 15,
    margin: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  healthguard: {
    fontSize: 48,
    fontStyle: "italic",
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#5AC733",
    marginBottom: 20,
  },
  image5Icon: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 18,
    fontFamily: "Inter-Regular",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
    fontWeight: "600",
  },
});

export default Icon;
