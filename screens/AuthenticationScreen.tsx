import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { SignIn } from "../components/SignIn";
import { SignUp } from "../components/SignUp";
import { ForgetPassword } from "../components/ForgetPassword";

export enum AuthScreenState {
    SignIn = "SIGN_IN",
    SignUp = "SIGN_UP",
    ForgetPassword = "FORGET_PASSWORD"
}

export const AuthenticationScreen = () => {
  const [state, setState] = useState<AuthScreenState>(AuthScreenState.SignIn);

  const renderComponents = () => { 
    switch(state) {
        case AuthScreenState.SignIn:
            return (
                <SignIn 
                    onSwitch={() => setState(AuthScreenState.SignUp)}
                    onForget={() => setState(AuthScreenState.ForgetPassword)}
                />
            );
        case AuthScreenState.SignUp:
            return (
                <SignUp 
                    onSwitch={() => setState(AuthScreenState.SignIn)} 
                />
            );
        case AuthScreenState.ForgetPassword:
            return (
                <ForgetPassword 
                    // Düzeltme: Alt bileşendeki isimle (onSwitch) uyumlu hale getirildi
                    onSwitch={() => setState(AuthScreenState.SignIn)} 
                />
            ); 
        default:
            return (
                <SignIn 
                    onSwitch={() => setState(AuthScreenState.SignUp)}
                    onForget={() => setState(AuthScreenState.ForgetPassword)}
                />
            );       
    }
  };

  return (
    <View style={styles.container}>
      {renderComponents()} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});