import React, {useEffect,useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { LoginButton, AccessToken } from 'react-native-fbsdk';
// here we will configure the google for sign in

// Somewhere in your code

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
function App(): React.JSX.Element {
  let [userData,setUserData] = useState({});
  useEffect(()=>{
    GoogleSignin.configure({
      webClientId: "",
      offlineAccess:true,
    });
  },[]);
  let _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      Alert.alert(JSON.stringify(userInfo));
      const currentUser = GoogleSignin.getCurrentUser();
      console.log(currentUser);
      setUserData({ userInfo });
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            Alert.alert(statusCodes.SIGN_IN_CANCELLED);
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            Alert.alert(statusCodes.IN_PROGRESS);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            Alert.alert(statusCodes.PLAY_SERVICES_NOT_AVAILABLE);
            break;
          default:
            // some other error happened
            Alert.alert(error.code);
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={_signIn}
        />
        </View>
        <View style={{ flex: 1 }}>
         <LoginButton
          onLoginFinished={
            (error:any, result:any) => {
              if (error) {
                console.log("login has error: " + result.error);
              } else if (result.isCancelled) {
                console.log("login is cancelled.");
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data:any) => {
                    console.log(data);
                    console.log(data.accessToken.toString())
                  }
                )
              }
            }
          }
          onLogoutFinished={() => console.log("logout.")}/>
          </View>
          
    </SafeAreaView>
  );
}
export default App;
