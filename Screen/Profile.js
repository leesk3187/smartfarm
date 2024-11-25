import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Pressable } from 'react-native';

const Profile = ({ navigation, route }) => {
  const [name, setName] = useState(route.params?.name || '');
  const [profileImage, setProfileImage] = useState(route.params?.profileImage || require('../assets/Ellipse 1.png'));

  const handleUpdateProfile = () => {
    Alert.alert('프로필 업데이트', '프로필이 성공적으로 업데이트되었습니다.', [
      { text: 'OK', onPress: () => navigation.navigate('Home', { name, profileImage }) }
    ]);
  };

  const handleSelectImage = (image) => {
    setProfileImage(image);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>뒤로가기</Text>
      </TouchableOpacity>
      <Text style={styles.header}>내 프로필</Text>
      <View style={styles.imageContainer}>
        <Image source={profileImage} style={styles.profileImage} />
        <View style={styles.imageOptions}>
          <Pressable onPress={() => handleSelectImage(require('../assets/profile1.png'))}>
            <Image source={require('../assets/profile1.png')} style={styles.optionImage} />
          </Pressable>
          <Pressable onPress={() => handleSelectImage(require('../assets/profile2.png'))}>
            <Image source={require('../assets/profile2.png')} style={styles.optionImage} />
          </Pressable>
          <Pressable onPress={() => handleSelectImage(require('../assets/profile3.png'))}>
            <Image source={require('../assets/profile3.png')} style={styles.optionImage} />
          </Pressable>
          <Pressable onPress={() => handleSelectImage(require('../assets/logo.png'))}>
            <Image source={require('../assets/logo.png')} style={styles.optionImage} />
          </Pressable>
          <Pressable onPress={() => handleSelectImage(require('../assets/Ellipse 1.png'))}>
            <Image source={require('../assets/Ellipse 1.png')} style={styles.optionImage} />
          </Pressable>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>닉네임 *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.updateButtonText}>프로필 업데이트</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center"
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5d5fef',
  },
  header: {
    fontSize: 36,
    color: "#000",
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    marginVertical: 20
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  imageOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  optionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    marginBottom: 5
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "Inter-Regular"
  },
  updateButton: {
    backgroundColor: "#73d668",
    width: "80%",
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginVertical: 20
  },
  updateButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    fontStyle: "italic"
  }
});

export default Profile;
