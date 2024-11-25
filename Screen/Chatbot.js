import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = ''; 
  const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

  useEffect(() => {
    // 챗봇이 처음 메시지를 보냄
    addMessage('bot', '어떤 식물정보가 궁금하신가요?');
  }, []);

  const addMessage = (sender, message) => {
    setMessages(prevMessages => [...prevMessages, { sender, message }]);
  };

  const handleSendMessage = async () => {
    const message = userInput.trim();
    if (message.length === 0) return;

    addMessage('user', message);
    setUserInput('');
    setLoading(true);

    try {
      let aiResponse = '';

      if (message) {
        // OpenAI API를 사용하여 식물의 환경 조건 정보 검색
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{ role: "user", content: `${message}의 최적 재배 환경에 대한 정보를 알려줘. 최고기온, 최저기온, 최고습도, 최저습도, 최고토양습도, 최저토양습도 값을 포함해서. Bold 형식 없이 응답` }],
            max_tokens: 1024,
            top_p: 1,
            temperature: 0.5,
            frequency_penalty: 0,
            presence_penalty: 0,
          }),
        });

        const data = await response.json();
        aiResponse = data.choices?.[0]?.message?.content || 'GPT 응답을 가져올 수 없습니다.';
      }

      addMessage('bot', aiResponse);
    } catch (error) {
      console.error('오류 발생!', error);
      addMessage('bot', '응답을 처리하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
      <Text style={item.sender === 'user' ? styles.userMessageText : styles.botMessageText}>
        {item.message}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.chat}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      {loading && <ActivityIndicator size="large" color="#00796b" style={styles.loading} />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요"
          value={userInput}
          onChangeText={setUserInput}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Image source={require('../assets/quill_send.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
  chat: {
    flex: 1,
    marginBottom: 10,
  },
  chatContainer: {
    paddingBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#73d668',
    borderRadius: 20,
    padding: 15,
    marginVertical: 5,
    maxWidth: '75%',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    marginVertical: 5,
    maxWidth: '75%',
    marginLeft: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  userMessageText: {
    color: '#fff',
    fontSize: 16,
  },
  botMessageText: {
    color: '#333',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 25,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#73d668',
    borderRadius: 25,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  sendIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  loading: {
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f2f2f2',
    paddingTop: 40, // 상단 공백 추가
},
});

export default Chatbot;
