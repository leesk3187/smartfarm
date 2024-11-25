import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Image, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

const Home = ({ navigation, route }) => {
  const [userName, setUserName] = useState(route.params?.name || '사용자');
  const [profileImage, setProfileImage] = useState(route.params?.profileImage || require('../assets/Ellipse 1.png'));

  useEffect(() => {
    if (route.params?.name) {
      setUserName(route.params.name);
    }
    if (route.params?.profileImage) {
      setProfileImage(route.params.profileImage);
    }
  }, [route.params]);

  return (
    <ScrollView contentContainerStyle={styles.viewStyle}>
      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <View>
          <Text style={styles.userName}>{userName}</Text>
          <Pressable onPress={() => navigation.navigate('Profile', { name: userName, profileImage })}>
            <Text style={styles.profileEditText}>프로필 수정</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.lineStyle}></View>

      <MenuSection
        icon={require('../assets/control.png')}
        title="환경제어"
        description="스마트팜의 환경을 조절해보세요!"
        onPress={() => navigation.navigate('Settings')}
      />

      <MenuSection
        icon={require('../assets/live.png')}
        title="실시간 식물상태"
        description="내가 적용한 프리셋이 작동하는지 확인하세요!"
        onPress={() => navigation.navigate('LiveData')}
      />

      <MenuSection
        icon={require('../assets/chat.png')}
        title="챗봇"
        description="챗봇에게 키우고 싶은 작물의 최적값을 알아보세요!"
        onPress={() => navigation.navigate('Chatbot')}
      />

      <MenuSection
        icon={require('../assets/graph.png')}
        title="그래프"
        description="스마트팜 환경 상태를 그래프로 확인할 수 있습니다."
        onPress={() => navigation.navigate('Graph')}
      />
    </ScrollView>
  );
};

const MenuSection = ({ icon, title, description, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.section,
        isPressed || pressed ? styles.pressedButton : null,
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
    >
      <Image source={icon} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonText}>이동</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: '#F4F8F7',
    flex: 1,
    padding: 20,
    paddingTop: 40, // 상단 공백 추가
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
  },
  profileEditText: {
    fontSize: 14,
    color: '#73d668',
    textDecorationLine: 'underline',
  },
  lineStyle: {
    height: 1,
    backgroundColor: '#D1D8E0',
    marginVertical: 20,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  pressedButton: {
    backgroundColor: '#D9F2D9', // 눌렸을 때의 배경색
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495E',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  button: {
    backgroundColor: '#73d668',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Home;
