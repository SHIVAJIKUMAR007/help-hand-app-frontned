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
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;

function Header({ navigation }) {
  const [select, setselect] = useState("Medical");
  const [searchItem, setsearchItem] = useState("");
  const [city, setcity] = useState("");
  const [showNav, setshowNav] = useState(false);
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

  const SearchIt = () => {
    if (searchItem === "") {
      Alert.alert("", "please enter item name before search.");
      return;
    }
    navigation.navigate("Search", {
      type: select,
      toSearch: searchItem,
      city: city === "" ? user?.city : city,
    });
  };
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
        <Picker
          selectedValue={select}
          onValueChange={(val) => setselect(val)}
          mode="dropdown"
          style={styles.select}
        >
          <Picker.Item value="Medical" label="Medical" />
          <Picker.Item value="Food" label="Food" />
          <Picker.Item value="Other" label="Other" />
        </Picker>
        <TextInput
          style={styles.input}
          value={searchItem}
          onChangeText={(itemname) => setsearchItem(itemname)}
          placeholder="Name of item"
        />
        <TextInput
          style={{ borderLeftWidth: 0, ...styles.input }}
          placeholder="city"
          value={city}
          onChangeText={(city) => setcity(city)}
        />
        <Feather
          style={{
            color: "black",
            marginLeft: 10,
          }}
          name="search"
          color="white"
          size={24}
          onPress={SearchIt}
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
              navigation.navigate("SignHome");
            }}
          >
            <Text style={{ textAlign: "center" }}>Home</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setshowNav(false);
              navigation.navigate("CreateHelp");
            }}
          >
            <Text style={{ textAlign: "center" }}>Create Help</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setshowNav(false);
              navigation.navigate("AllChat");
            }}
          >
            <Text style={{ textAlign: "center" }}>Chat</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setshowNav(false);
              navigation.navigate("RequestItem");
            }}
          >
            <Text style={{ textAlign: "center" }}>Request</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setshowNav(false);
              navigation.navigate("Profile", {
                id: "own",
              });
            }}
          >
            <Text style={{ textAlign: "center" }}>Profile</Text>
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
