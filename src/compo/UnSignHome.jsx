import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");

function UnSignHome({ navigation }) {
  return (
    <View>
      <Image
        style={styles.image}
        source={require("../../assets/images/helping-hands.png")}
      />
      <View style={styles.center}>
        <View>
          <Text
            style={{ fontSize: 30, fontWeight: "700", textAlign: "center" }}
          >
            Many are here
            {`\n`}
            Were are You
          </Text>
          <Text style={{ textAlign: "center" }}>
            Need help, here are many people who are ready
            {`\n`}
            to help you, just find a right person and
            {`\n`}
            start chatting with him.
            {`\n`}
            {`\n`}
            You want to contribute to society,
            {`\n`}
            help others people nearby you,
            {`\n`}
            who really need your help.
            {`\n`}
          </Text>
          <View
            style={{
              width: "100%",
              marginTop: 20,
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Button
              style={styles.button}
              title="Login"
              onPress={() => navigation.navigate("Login")}
            ></Button>
            <Button
              style={styles.button}
              title="Register"
              onPress={() => navigation.navigate("Register")}
            ></Button>
          </View>
        </View>
      </View>
    </View>
  );
}

export default UnSignHome;

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 270,
  },
  center: {
    marginTop: 40,
    width: width,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "fit-content",
  },
});
