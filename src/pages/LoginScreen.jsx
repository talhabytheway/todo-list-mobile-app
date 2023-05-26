import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
  StyleSheet,
  ImageBackground,
  Keyboard,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

import {auth} from '../firebase/config';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import actionCreators from '../store/actionCreators';
import {useDispatch} from 'react-redux';

import bgImg from '../assets/images/bg.png';
import Google from '../assets/svgs/Google';
import Facebook from '../assets/svgs/Facebook';
import Apple from '../assets/svgs/Apple';

import colors from '../constants/colors';
import ratios from '../constants/ratios';
import fonts from '../constants/fonts';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isKeyboardActive, setKeyboardActive] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardActive(true),
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardActive(false),
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgetPassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      Toast.show({
        type: 'error',
        text1: `Enter Email to get reset link`,
      });
    } else if (emailRegex.test(email)) {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Toast.show({
            type: 'success',
            text1: `Reset link sent to email`,
          });
        })
        .catch(error => {
          let code = error.code.split('/');
          Toast.show({
            type: 'error',
            text1: `${code[0]} error ⚠️`,
            text2: `${code[1].replace(/-/g, ' ')}`,
          });
        });
    } else {
      Toast.show({
        type: 'error',
        text1: `Enter Valid Email to get reset link`,
      });
    }
  };
  const handleSubmit = () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields',
      });
    } else if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Please enter a valid email address',
      });
    } else if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Password should be at least 8 characters long',
      });
    } else onLoginPress();
  };

  const onFooterLinkPress = () => {
    navigation.navigate('Registration');
  };

  const onLoginPress = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        dispatch(
          actionCreators.setAuth(
            userCredential.user.uid,
            userCredential.user.displayName,
            userCredential.user.email,
          ),
        );
      })
      .finally(() => {
        Toast.show({
          type: 'success',
          text1: `Signed in Successfully ✅`,
        });
      })
      .catch(error => {
        let code = error.code.split('/');
        Toast.show({
          type: 'error',
          text1: `${code[0]} error ⚠️`,
          text2: `${code[1].replace(/-/g, ' ')}`,
        });
      });
  };

  return (
    <ImageBackground
      source={!isKeyboardActive ? bgImg : ''}
      resizeMode="cover"
      style={styles.bg}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
        <View style={styles.parent}>
          <Text style={styles.mainHeading}>Login</Text>
          <View style={styles.inputPar}>
            <View style={styles.textBoxPar1}>
              <Text style={styles.textBoxText}>Email</Text>
              <TextInput
                style={styles.textBox}
                placeholder="Email"
                placeholderTextColor={colors.beige}
                onChangeText={text => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                autoFocus={true}
                inputMode="email"
              />
            </View>
            <View style={styles.textBoxPar2}>
              <Text style={styles.textBoxText}>Password</Text>
              <TextInput
                style={styles.textBox}
                placeholderTextColor={colors.beige}
                secureTextEntry
                placeholder="Password"
                onChangeText={text => setPassword(text)}
                value={password}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity onPress={handleForgetPassword}>
              <Text style={styles.forgPass}>Forget Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoPar}>
            <TouchableOpacity style={styles.logo}>
              <Google />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logo}>
              <Facebook />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logo}>
              <Apple />
            </TouchableOpacity>
          </View>
          <View style={styles.parCTA}>
            <View style={styles.secCtaPar}>
              <Text style={styles.secCta}>New Here? </Text>
              <TouchableOpacity onPress={onFooterLinkPress}>
                <Text style={styles.secCtaBtn}>Register</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSubmit} style={styles.mainCtaPar}>
              <Text style={styles.mainCta}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    position: 'relative',
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    backgroundColor: colors.pink,
  },
  parent: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginLeft: ratios.widthPixel(20),
    marginRight: ratios.widthPixel(32),
    marginBottom: ratios.widthPixel(20),
  },
  mainHeading: {
    fontFamily: fonts.bol,
    fontSize: ratios.fontPixel(37),
    color: colors.beige,
    paddingBottom: ratios.widthPixel(24),
  },
  textBoxPar1: {
    marginBottom: ratios.widthPixel(20),
  },
  textBoxPar2: {
    marginBottom: ratios.widthPixel(12),
  },
  textBox: {
    borderWidth: ratios.widthPixel(1.5),
    borderColor: colors.beige,
    borderRadius: ratios.widthPixel(10),
    paddingHorizontal: ratios.widthPixel(10),
    paddingVertical: ratios.heightPixel(6),
    color: colors.beige,
  },
  textBoxText: {
    fontFamily: fonts.reg,
    fontSize: ratios.fontPixel(15),
    color: colors.beige,
    paddingBottom: ratios.heightPixel(4),
  },
  forgPass: {
    fontFamily: fonts.bol,
    fontSize: ratios.fontPixel(15),
    color: colors.beige,
    textAlign: 'right',
  },
  inputPar: {
    marginRight: ratios.widthPixel(48),
  },
  logo: {
    padding: ratios.widthPixel(8),
    backgroundColor: colors.beige,
    borderRadius: ratios.widthPixel(5),
    elevation: ratios.widthPixel(6),
    shadowColor: '#000',
    shadowOffset: {width: ratios.widthPixel(3), height: ratios.widthPixel(2)},
    shadowOpacity: 0.25,
    shadowRadius: ratios.widthPixel(20),
  },
  logoPar: {
    flexDirection: 'row',
    gap: ratios.widthPixel(16),
  },
  parCTA: {
    marginTop: ratios.widthPixel(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainCtaPar: {
    backgroundColor: colors.beige,
    paddingHorizontal: ratios.widthPixel(42),
    paddingVertical: ratios.widthPixel(12),
    borderRadius: ratios.widthPixel(7),
    elevation: ratios.widthPixel(6),
    shadowColor: '#000',
    shadowOffset: {width: ratios.widthPixel(3), height: ratios.widthPixel(2)},
    shadowOpacity: 0.25,
    shadowRadius: ratios.widthPixel(20),
  },
  mainCta: {
    fontFamily: fonts.reg,
    fontSize: ratios.fontPixel(24),
    color: colors.brown,
  },
  secCtaPar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: ratios.widthPixel(4),
  },
  secCta: {
    fontFamily: fonts.reg,
    fontSize: ratios.fontPixel(17),
    color: colors.beige,
  },
  secCtaBtn: {
    fontFamily: fonts.bol,
    fontSize: ratios.fontPixel(17),
    color: colors.beige,
  },
});
