import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Picker,
  Dimensions,
  NativeModules,
  Platform,
  Text,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;

function Header({ navigation, suspend }) {
  const [showNav, setshowNav] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <Feather
          name="menu"
          size={24}
          style={{ marginLeft: 10 }}
          color="black"
          onPress={() => {
            setshowNav((pre) => !pre);
          }}
        />
      </View>

      {showNav ? (
        <View
          style={{
            width: width,
            flexDirection: "column",
          }}
        >
          <Pressable
            style={styles.button}
            onPress={() => {
              setshowNav(false);
              navigation.navigate(suspend ? "Suspend" : "VarifyEmail");
            }}
          >
            <Text style={{ textAlign: "center" }}>Home</Text>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={async () => {
              // logout from here first
              await AsyncStorage.removeItem("user");

              //navigate unsign home
              navigation.navigate("Home");
            }}
          >
            <Text style={{ textAlign: "center" }}>Logout</Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );
}

export default Header;

const styles = StyleSheet.create({
  header: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    overflow: "visible",
    marginTop: STATUSBAR_HEIGHT + 10,
    marginBottom: 10,
  },
  select: {
    width: "24%",
    borderColor: "black",
    color: "black",
    borderWidth: 2,
    borderStyle: "solid",
  },
  input: {
    width: "27%",
    paddingHorizontal: 2,
    borderColor: "black",
    borderWidth: 2,
    borderStyle: "solid",
  },
  button: {
    width: "100%",
    height: 30,
    lineHeight: 30,
  },
});
