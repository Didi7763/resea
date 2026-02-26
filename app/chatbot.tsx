import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { COLORS } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  options?: string[] | null;
}

interface ChatStepResponse {
  sessionId: string;
  message: string;
  type: string;
  options?: string[] | null;
  done?: boolean;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_CHATBOT_API ?? 'http://localhost:4000';

const ChatbotScreen: React.FC = () => {
  const { colors, dark } = useTheme();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentStepType, setCurrentStepType] = useState<string>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const startConversation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/chat/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Impossible de lancer la conversation');
      }

      const data: ChatStepResponse = await response.json();
      setSessionId(data.sessionId);
      setCurrentStepType(data.type);
      appendMessage({
        id: `${Date.now()}-bot`,
        role: 'bot',
        text: data.message,
        options: data.type === 'choice' ? data.options ?? [] : null
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage]);

  useEffect(() => {
    startConversation();
  }, [startConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleAnswer = useCallback(async (value: string) => {
    if (!sessionId || !value.trim() || isLoading) {
      return;
    }

    const answer = value.trim();
    appendMessage({
      id: `${Date.now()}-user`,
      role: 'user',
      text: answer
    });
    setInputValue('');

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/chat/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId, answer })
      });

      if (!response.ok) {
        throw new Error('Réponse impossible, réessaie.');
      }

      const data: ChatStepResponse = await response.json();
      setCurrentStepType(data.type);

      appendMessage({
        id: `${Date.now()}-bot`,
        role: 'bot',
        text: data.message,
        options: data.type === 'choice' ? data.options ?? [] : null
      });

      if (data.done) {
        setSessionId(data.sessionId);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [appendMessage, isLoading, sessionId]);

  const handleOptionPress = useCallback((option: string) => {
    handleAnswer(option);
  }, [handleAnswer]);

  const isInputDisabled = useMemo(() => {
    return currentStepType === 'choice' || currentStepType === 'end' || isLoading;
  }, [currentStepType, isLoading]);

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isBot = item.role === 'bot';
    return (
      <View
        style={[
          styles.messageContainer,
          isBot ? styles.botMessage : styles.userMessage,
          { backgroundColor: isBot ? (dark ? COLORS.dark2 : COLORS.secondaryWhite) : COLORS.primary }
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isBot ? (dark ? COLORS.white : COLORS.greyscale900) : COLORS.white }
          ]}
        >
          {item.text}
        </Text>
        {isBot && item.options && item.options.length > 0 && (
          <View style={styles.optionsContainer}>
            {item.options.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.optionButton}
                onPress={() => handleOptionPress(option)}
                disabled={isLoading}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}> 
          <View style={styles.header}> 
            <Text style={[styles.title, { color: colors.text }]}>Chat avec Dodo</Text>
            <Text style={[styles.subtitle, { color: colors.text }]}>
              Ton assistant fun pour réserver vite et bien.
            </Text>
          </View>
          <FlatList
            ref={listRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="warning" size={16} color={COLORS.white} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          <View style={[styles.inputRow, { backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite }]}> 
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={isInputDisabled ? 'Choisis une option pour continuer' : 'Écris ta réponse...'}
              placeholderTextColor={COLORS.grayscale400}
              style={[styles.input, { color: colors.text }]}
              editable={!isInputDisabled}
              onSubmitEditing={() => handleAnswer(inputValue)}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.sendButton, isInputDisabled && styles.sendButtonDisabled]}
              onPress={() => handleAnswer(inputValue)}
              disabled={isInputDisabled}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Ionicons name="paper-plane" size={18} color={COLORS.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24
  },
  header: {
    marginTop: 16,
    marginBottom: 16
  },
  title: {
    fontFamily: 'bold',
    fontSize: 24
  },
  subtitle: {
    marginTop: 6,
    fontFamily: 'medium',
    fontSize: 14
  },
  messagesList: {
    flexGrow: 1,
    paddingVertical: 12
  },
  messageContainer: {
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  botMessage: {
    alignSelf: 'flex-start'
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary
  },
  messageText: {
    fontFamily: 'regular',
    fontSize: 15,
    lineHeight: 22
  },
  optionsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    marginRight: 8,
    marginBottom: 8
  },
  optionText: {
    color: COLORS.white,
    fontFamily: 'semiBold',
    fontSize: 13
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 12
  },
  input: {
    flex: 1,
    fontFamily: 'regular',
    fontSize: 15,
    paddingVertical: 8
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.grayscale300
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8
  },
  errorText: {
    color: COLORS.white,
    fontFamily: 'medium'
  }
});

export default ChatbotScreen;
