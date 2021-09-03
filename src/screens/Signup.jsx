import React, { useRef, useState } from "react";
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
import { Form, InputText } from "validate-form-in-expo-style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, Entypo } from "@expo/vector-icons";
import Header from "../compo/Header";
import axios from "../axios";

const { width, height } = Dimensions.get("window");

function Signup({ navigation }) {
  const [signupData, setsignupData] = useState({
    username: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    password: "",
    cpassword: "",
  });
  const [isUsernameUnique, setisUsernameUnique] = useState(0);
  const [isEmailUnique, setisEmailUnique] = useState(0);
  const form = useRef();

  const checkUsername = async (user) => {
    setsignupData((pre) => {
      return {
        ...pre,
        username: user,
      };
    });
    setisUsernameUnique(1);
    try {
      let check = await (
        await axios.get(`/api/auth/usernameExists/${user ? user : "shivaji"}`)
      ).data;
      if (check.err) setisUsernameUnique(-1);
      else setisUsernameUnique(2);
    } catch (error) {
      console.warn(error);
      setisUsernameUnique(1);
    }
  };
  const checkEmail = async (email) => {
    setsignupData((pre) => {
      return {
        ...pre,
        email: email,
      };
    });
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    setisEmailUnique(1);
    if (!email.match(validRegex)) {
      setisEmailUnique(3);
      return;
    }
    try {
      let check = await (
        await axios.get(
          `/api/auth/emailExists/${email ? email : "shivaji@gmail.com"}`
        )
      ).data;
      if (check.err) setisEmailUnique(-1);
      else setisEmailUnique(2);
    } catch (error) {
      console.warn(error);
      setisEmailUnique(1);
    }
  };

  const submit = async () => {
    if (signupData.password !== signupData.cpassword) {
      Alert.alert("", "Confirm password must be same as password...");
      return;
    }
    if (isEmailUnique !== 2 || isUsernameUnique !== 2) {
      Alert.alert(
        "",
        "Username or email is already registered. Please Choose unique username and email."
      );
      return;
    }

    if (signupData.password.length < 6) {
      Alert.alert(
        "To short password",
        "Password must be atleast 6 character long."
      );
      return;
    }
    if (
      signupData.city == "" ||
      signupData.state == "" ||
      signupData.country == "" ||
      signupData.pincode == ""
    ) {
      Alert.alert("Fill correct address", "Address Field cannot be empty");
      return;
    }
    if (signupData.mobile == null) {
      Alert.alert("Fill Mobile number", "Mobile number cannot be empty");
      return;
    }
    try {
      let signupRes = await axios.post("/api/auth/signup", signupData);
      signupRes = await signupRes.data;
      if (signupRes.msg === "ok") {
        Alert.alert(
          "",
          "You are registered on Help Hand, Now varify your email."
        );
        let user = await AsyncStorage.setItem(
          "user",
          JSON.stringify(signupRes.data)
        );
        navigation.navigate("VarifyEmail");
      } else {
        Alert.alert("", "Server is temprerory down!!!!");
      }
    } catch (error) {
      console.log(error);
    }
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
          Register
        </Text>
        <Text style={{ marginVertical: 5, marginHorizontal: 10 }}>
          Choose your way to give back to society. Join the community and play
          your part in keeping alive the Humanity.
        </Text>
        <Form ref={form} onSubmit={submit} style={{ width: "90%" }}>
          <InputText
            style={styles.input}
            autoCompleteType="username"
            value={signupData.username}
            onChangeText={checkUsername}
            placeholder="Username"
            leftIcon={<Loader val={isUsernameUnique} />}
          />

          <InputText
            style={styles.input}
            autoCompleteType="email"
            value={signupData.email}
            onChangeText={checkEmail}
            placeholder="Email"
            leftIcon={<Loader val={isEmailUnique} />}
          />
          <InputText
            style={styles.input}
            keyboardType="numeric"
            autoCompleteType="tel"
            value={signupData.mobile}
            onChangeText={(mobile) => {
              setsignupData((pre) => {
                return { ...pre, mobile: mobile.toString() };
              });
            }}
            placeholder="Mobile No."
          />
          <InputText
            style={styles.input}
            value={signupData.city}
            onChangeText={(city) => {
              setsignupData((pre) => {
                return { ...pre, city: city };
              });
            }}
            placeholder="city"
          />
          <InputText
            style={styles.input}
            value={signupData.state}
            onChangeText={(state) => {
              setsignupData((pre) => {
                return { ...pre, state: state };
              });
            }}
            placeholder="State"
          />
          <InputText
            onChangeText={(country) => {
              setsignupData((pre) => {
                return { ...pre, country: country };
              });
            }}
            style={styles.input}
            value={signupData.country}
            placeholder="Country"
          />
          <InputText
            style={styles.input}
            onChangeText={(pin) => {
              setsignupData((pre) => {
                return { ...pre, pincode: pin.toString() };
              });
            }}
            value={signupData.pincode}
            autoCompleteType="postal-code"
            keyboardType="numeric"
            placeholder="Pin Code"
          />
          <InputText
            onChangeText={(pass) => {
              setsignupData((pre) => {
                return { ...pre, password: pass };
              });
            }}
            value={signupData.password}
            secureTextEntry
            style={styles.input}
            autoCompleteType="password"
            autoCorrect={false}
            placeholder="Password"
          />
          <InputText
            onChangeText={(cpass) => {
              setsignupData((pre) => {
                return { ...pre, cpassword: cpass };
              });
            }}
            secureTextEntry
            style={styles.input}
            value={signupData.cpassword}
            autoCompleteType="password"
            autoCorrect={false}
            placeholder="Confirm Password"
          />

          <View style={{ marginVertical: 10 }}>
            <Button onPress={submit} title="Sign Up" />
          </View>
        </Form>
        <Text style={{ marginBottom: 10, textAlign: "center" }}>
          Already have an Account?{" "}
          <Text
            style={{ color: "#0779e4" }}
            onPress={() => navigation.navigate("Login")}
          >
            Sign in
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const Loader = ({ val }) => {
  return (
    <>
      {val === 0 ? null : val === 1 ? (
        <Feather name="loader" color="black" size={20} />
      ) : val === 2 ? (
        <Feather name="check" color="green" size={20} />
      ) : val === 3 ? (
        <>
          <Text style={{ color: "orange" }}> Not a Email </Text>
        </>
      ) : (
        <Entypo name="cross" color="red" size={20} />
      )}
    </>
  );
};

export default Signup;

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
    // width: "90%",
    borderColor: "black",
    borderWidth: 2,
    marginVertical: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderStyle: "solid",
    borderRadius: 7,
  },
});
