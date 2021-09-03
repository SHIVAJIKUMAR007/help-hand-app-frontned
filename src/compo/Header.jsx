import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Text,
  Platform,
  NativeModules,
} from "react-native";
import { Feather } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
const { StatusBarManager } = NativeModules;

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBarManager.HEIGHT;

function Header({ navigation }) {
  const [select, setselect] = useState("Medical");
  const [showNav, setshowNav] = useState(false);

  return (
    <>
      <View style={styles.header}>
        <Feather
          name="menu"
          size={24}
          style={{ ...styles.button, marginLeft: 15 }}
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
              navigation.navigate("Home");
            }}
          >
            <Text style={{ textAlign: "center" }}>Home</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setshowNav(false);
              navigation.navigate("Login");
            }}
          >
            <Text style={{ textAlign: "center" }}>Login</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => {
              setshowNav(false);
              navigation.navigate("Register");
            }}
          >
            <Text style={{ textAlign: "center" }}>Register</Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );
}

export default Header;

const styles = StyleSheet.create({
  header: {
    marginTop: STATUSBAR_HEIGHT + 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  button: {
    width: "100%",
    height: 30,
    lineHeight: 30,
  },
});

// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, TextInput, Picker } from "react-native";
// import { Feather } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useSelector, useDispatch } from "react-redux";
// import { login } from "../redux/action";

// function Header({ navigation }) {
//   const [select, setselect] = useState("Medical");
//   const user2 = useSelector((state) => state.user);
//   const [user, setuser] = useState(null);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     AsyncStorage.getItem("user")
//       .then((u) => {
//         setuser(JSON.parse(u));
//       })
//       .catch((err) => console.warn(err));
//     // setuser(user2._W);
//     console.warn(user);
//   }, []);
//   return (
//     <>
//       <View style={styles.header}>
//         <Feather
//           name="menu"
//           size={24}
//           style={styles.button}
//           color="black"
//           onPress={() => {
//             navigation.toggleDrawer();
//           }}
//         />
//         {user ? (
//           <>
//             <Picker
//               selectedValue={select}
//               onValueChange={(val) => setselect(val)}
//               mode="dropdown"
//               style={styles.select}
//             >
//               <Picker.Item value="Medical" label="Medical" />
//               <Picker.Item value="Food" label="Food" />
//               <Picker.Item value="Other" label="Other" />
//             </Picker>
//             <TextInput
//               style={styles.input}
//               placeholder="Name of item"
//               name="itemName"
//             />
//             <TextInput
//               style={{ borderLeftWidth: 0, ...styles.input }}
//               placeholder="city"
//               name="city"
//             />
//             <Feather
//               style={{
//                 ...styles.button,
//               }}
//               name="search"
//               color="white"
//               size={24}
//               onPress={() => {}}
//             />
//           </>
//         ) : null}
//       </View>
//     </>
//   );
// }

// export default Header;

// const styles = StyleSheet.create({
//   header: {
//     height: 100,
//     flexDirection: "row",
//     lineHeight: 100,
//     alignItems: "center",
//   },
//   select: {
//     width: "24%",
//     borderColor: "black",
//     color: "black",
//     borderWidth: 2,
//     borderStyle: "solid",
//   },
//   input: {
//     width: "27%",
//     paddingHorizontal: 2,
//     borderColor: "black",
//     borderWidth: 2,
//     borderStyle: "solid",
//   },
//   button: {
//     width: "10%",
//     color: "black",
//     marginLeft: 5,
//   },
// });
