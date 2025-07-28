import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

export default function CustomerServiceScreen() {
  const callSupport = () => {
    Linking.openURL('tel:+2250700000000');
  };

  const emailSupport = () => {
    Linking.openURL('mailto:support@reasa.ci');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Client</Text>
      <Text style={styles.subtitle}>Nous sommes disponibles 24h/24 pour vous assister.</Text>

      <TouchableOpacity style={styles.button} onPress={callSupport}>
        <Text style={styles.buttonText}>Appeler le support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={emailSupport}>
        <Text style={styles.buttonText}>Envoyer un e-mail</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
