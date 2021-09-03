import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import HeaderSignButIncom from "../compo/HeaderSignButIncom";
const { width, height } = Dimensions.get("window");

function VarifyEmail({ navigation }) {
  const [otp, setotp] = useState(null);
  const [user, setuser] = useState(null);
  useEffect(() => {
    const a = async () => {
      try {
        let u = await AsyncStorage.getItem("user");
        setuser(JSON.parse(u));
      } catch (error) {
        console.log(error);
      }
    };
    a();
  }, []);

  const varifyOtp = async () => {
    if (otp === null) {
      Alert.alert(
        "Empty OTP",
        "Please Enter OTP you get on your registered email address."
      );
      return;
    }
    try {
      let varify = await axios.post("/api/emailVarify/varifyotp", {
        uid: user?._id,
        otp: otp,
        email: user?.email,
      });
      varify = varify.data;
      if (varify.err) {
        Alert.alert(varify.res);
      } else {
        AsyncStorage.setItem("user", JSON.parse(varify.user));
        setuser(varify.user);
        Alert.alert(varify.res);
        navigation.navigate("SignHome");
      }
    } catch (error) {
      Alert.alert("some error occured !!!");
    }
  };
  return (
    <>
      <View>
        <HeaderSignButIncom navigation={navigation} />
        <View
          style={{
            height: height - (15 * height) / 100,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>
              Varify Your Email First {"\n"}
            </Text>

            <Text>
              we have sent you a 6-digit otp on your given{"\n"} email address,{" "}
              <Text style={{ fontWeight: "700" }}>
                {user?.email}
                {"\n"}
              </Text>
            </Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={otp}
              onChangeText={(otp) => {
                setotp(otp);
              }}
            />
            <Button
              style={{ width: 200 }}
              onPress={varifyOtp}
              title="Varify OTP"
            />
          </View>
        </View>
      </View>
    </>
  );
}

export default VarifyEmail;

const styles = StyleSheet.create({
  input: {
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
    marginVertical: 10,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderStyle: "solid",
    borderRadius: 7,
  },
});
