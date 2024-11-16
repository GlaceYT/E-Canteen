import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, TextInput, Text, Modal, Portal, Provider, Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useAuthContext } from '../context/AuthContext';
import { storeData, getData, removeData } from '../utils/AsyncStorageUtils'; 
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showRoleSheet, setShowRoleSheet] = useState(false);

  const handleLogin = (role: 'admin' | 'student') => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setError('');
    login(role);
    
    // Save email and role
    storeData('userEmail', email);
    storeData('userRole', role);
  
    navigation.navigate(role === 'student' ? 'Student' : 'Admin');
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>
          Log In
        </Text>
        <Text style={styles.subtitle}>Thinko's Canteen</Text>

                <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, styles.roundedInput]} 
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          label="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={[styles.input, styles.roundedInput]} 
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Main Login Button */}
        <TouchableOpacity
          style={[styles.gradientButton, styles.mainButton]}
          onPress={() => setShowRoleSheet(true)}
        >
          <Text style={styles.buttonText}>LOG IN</Text>
        </TouchableOpacity>

        {/* Login with Facebook Button */}
        <TouchableOpacity style={[styles.facebookButton, styles.mainButton]}>
      <Text style={styles.facebookButtonText}>Login with Google</Text>
    </TouchableOpacity>


        {/* Divider and Sign Up Text */}
        <Text style={styles.orText}>Or create an account using Google</Text>
        <View style={styles.footerText}>
          <Text style={styles.footerNo}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Action Sheet for Role Selection */}
        <Portal>
          <Modal
            visible={showRoleSheet}
            onDismiss={() => setShowRoleSheet(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Select Login Role</Text>
            <Button
              mode="contained"
              onPress={() => {
                setShowRoleSheet(false);
                handleLogin('student');
              }}
              buttonColor="#007AFF"
              style={styles.roleButton}
            >
              Login as Students
            </Button>
            <Divider style={styles.divider} />
            <Button
              mode="contained"
              onPress={() => {
                setShowRoleSheet(false);
                handleLogin('admin');
              }}
              buttonColor="#FFA500"
              style={styles.roleButton}
            >
              Login as Admin
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontFamily: 'LeagueSpartan-Regular',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '400',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'LeagueSpartan-Regular',
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    fontFamily: 'LeagueSpartan-Regular',
    marginBottom: 20,
    backgroundColor: 'white',
  },
  roundedInput: {  
    fontFamily: 'LeagueSpartan-Regular',
    borderColor: '#ccc', 
  },
  errorText: {
    fontFamily: 'LeagueSpartan-Regular',
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  gradientButton: {
    fontFamily: 'LeagueSpartan-Regular',
    backgroundColor: '#FF4E50',
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  mainButton: {
    fontFamily: 'LeagueSpartan-Regular',
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'LeagueSpartan-Regular',
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  facebookButton: {
    fontFamily: 'LeagueSpartan-Regular',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b5998',
    borderRadius: 25,
    paddingVertical: 10,
  },
  facebookButtonIcon: {
    fontFamily: 'LeagueSpartan-Regular',
    color: 'white',
    fontSize: 20,
    marginRight: 10,
  },
  facebookButtonText: {
    fontFamily: 'LeagueSpartan-Regular',
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  orText: {
    fontFamily: 'LeagueSpartan-Regular',
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  footerText: {
    fontFamily: 'LeagueSpartan-Regular',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    fontFamily: 'LeagueSpartan-Regular',
    color: '#FF4E50',
    fontWeight: '400',
  },
  modalContainer: {
    fontFamily: 'LeagueSpartan-Regular',
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontFamily: 'LeagueSpartan-Regular',
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleButton: {
    fontFamily: 'LeagueSpartan-Regular',
    borderRadius: 25,
    paddingVertical: 8,
  },
  divider: {
    fontFamily: 'LeagueSpartan-Regular',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  footerNo:{
    fontFamily: 'LeagueSpartan-Regular',
  },
});
