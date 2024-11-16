import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import {
  Text,
  Avatar,
  Divider,
  Appbar,
  IconButton,
  Chip,
  Dialog,
  Portal,
  Button,
} from 'react-native-paper';
import { removeData, getData } from '../utils/AsyncStorageUtils';
import { useAuthContext } from '../context/AuthContext';

export default function Profile({ navigation }: any) {
  const { logout } = useAuthContext();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    const email = await getData('userEmail');
    const role = await getData('userRole');
    setUserEmail(email || 'example@domain.com');
    setUserRole(role || 'student');
  };

  const handleLogout = async () => {
    await removeData('userEmail');
    await removeData('userRole');
    logout();
    navigation.navigate('Login');
  };

  const handleLogoutConfirmation = () => {
    setDialogVisible(true);
    // Start animation for the dialog
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const settings = [
    { title: 'My Account', description: 'Manage your account settings' },
    { title: 'My Favourites', description: 'View and manage your favourites' },
    { title: 'Payments & Refunds', description: 'Manage payment methods and refunds' },
    { title: 'Giftcards', description: 'View and redeem giftcards' },
    { title: 'Rewards', description: 'Track and redeem your rewards' },
    { title: 'Refer & Earn', description: 'Invite friends to earn rewards' },
    { title: 'Languages', description: 'Choose your preferred language' },
    { title: 'About Us', description: 'Learn more about us' },
    { title: 'Privacy & Security', description: 'Your data and account security' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerContainer}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title="Profile" titleStyle={styles.headerTitle} />
        </Appbar.Header>
        <View style={styles.profileInfo}>
          <Avatar.Icon size={100} icon="account" style={styles.avatar} />
          <Text style={styles.userName}>{userEmail || 'User Name'}</Text>
          <Text style={styles.userRole}>{userRole.toUpperCase()}</Text>
        </View>
      </View>

      {/* Scrollable Settings Section */}
      <ScrollView style={styles.settingsContainer}>
        {settings.map((item, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
              <IconButton icon="chevron-right" size={24} />
            </TouchableOpacity>
            <Divider style={styles.divider} />
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity onPress={handleLogoutConfirmation}>
          <Chip style={styles.logoutChip}>Logout</Chip>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title style={styles.dialogTitle}>Confirm Logout</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Are you sure you want to log out?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setDialogVisible(false)}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
            >
              Cancel
            </Button>
            <Button
              onPress={handleLogout}
              style={styles.confirmButton}
              labelStyle={styles.confirmButtonText}
            >
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    backgroundColor: '#FF5722',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 30,
    alignItems: 'center',
    elevation: 4,
  },
  appbar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 22,
    alignSelf: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -10,
  },
  avatar: {
    backgroundColor: '#FF69B4',
    elevation: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginTop: 10,
  },
  userRole: {
    fontSize: 14,
    color: '#FFD1C1',
    textTransform: 'uppercase',
    marginTop: 5,
  },
  settingsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    height: 3,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  logoutChip: {
    alignSelf: 'center',
    marginVertical: 20,
    backgroundColor: '#FF5722',
    color: '#FF00FF',
  },
  dialogTitle: {
    fontWeight: '600',
    fontSize: 18,
    color: '#FF5722',
  },
  dialogText: {
    fontSize: 16,
    color: '#333',
  },
  cancelButton: {
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#FF5722',
  },
  confirmButton: {
    backgroundColor: '#FF5722',
  },
  confirmButtonText: {
    color: '#fff',
  },
});
