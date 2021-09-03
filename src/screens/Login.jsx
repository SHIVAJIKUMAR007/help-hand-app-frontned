import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import Header from "../compo/Header";
import { Form, InputText } from "validate-form-in-expo-style";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "../axios";

const { width, height } = Dimensions.get("window");

function Login({ navigation }) {
  const [loginData, setloginData] = useState({
    identifier: "",
    password: "",
  });
  const form = useRef();

  const submit = async () => {
    if (loginData.identifier == "") {
      Alert.alert(
        "Enter identifier",
        "Email or username field cannot be emepty"
      );
      return;
    } else if (loginData.password.length < 6) {
      Alert.alert(
        "To short password",
        "Password must be atleast 6 character long."
      );
      return;
    }

    try {
      let loginRes = await axios.post("/api/auth/login", loginData);
      loginRes = await loginRes.data;

      if (loginRes.err) {
        Alert.alert(loginRes.msg);
      } else {
        AsyncStorage.setItem("user", JSON.stringify(loginRes.user));
        Alert.alert(loginRes.msg);
        let user = loginRes.user;
        if (user.active === false) {
          navigation.navigate("Suspend");
        } else if (user.emailVarify === false) {
          navigation.navigate("VarifyEmail");
        } else navigation.navigate("SignHome");
      }
    } catch (error) {
      console.warn(error);
    }
    setloginData({ identifier: "", password: "" });
  };
  return (
    <ScrollView>
      <Header navigation={navigation} />
      <Image
        style={styles.image}
        source={require("../../assets/images/bgimg.jpg")}
      />
      <View style={styles.center}>
        <Text style={{ fontSize: 24, marginVertical: 10, fontWeight: "700" }}>
          Sign In
        </Text>
        <Text style={{ marginVertical: 5 }}>
          Welcome back to the Help Hand society.
        </Text>
        <Form ref={form} onSubmit={submit} style={{ width: "90%" }}>
          <InputText
            style={styles.input}
            autoCompleteType="username"
            placeholder="Username or Email"
            value={loginData.identifier}
            onChangeText={(iden) => {
              setloginData((pre) => {
                return {
                  ...pre,
                  identifier: iden,
                };
              });
            }}
          />
          <InputText
            secureTextEntry
            style={styles.input}
            autoCompleteType="password"
            autoCorrect={false}
            placeholder="Password"
            value={loginData.password}
            onChangeText={(pass) => {
              setloginData((pre) => {
                return {
                  ...pre,
                  password: pass,
                };
              });
            }}
          />
          <View style={{ marginVertical: 10 }}>
            <Button onPress={submit} title="Log In" />
          </View>
        </Form>

        <Text style={{ marginBottom: 10, textAlign: "center" }}>
          Not yet signed up? Join{"\n"}the society by{" "}
          <Text
            style={{ color: "#0779e4" }}
            onPress={() => navigation.navigate("Register")}
          >
            Registering.
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

export default Login;

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 270,
  },
  center: {
    marginTop: 40,
    width: (9 * width) / 10,
    marginLeft: width / 20,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: 10,
  },
  input: {
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
    marginVertical: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderStyle: "solid",
    borderRadius: 7,
  },
  button: {
    width: "fit-content",
  },
});
