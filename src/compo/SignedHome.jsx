import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  LogBox,
} from "react-native";
import AskForHelp from "./AskForHelp";
import HeaderSign from "./HeaderSign";
import Post from "./Post";
import axios from "../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
const { width } = Dimensions.get("window");

function SignedHome({ navigation }) {
  const [findNotProvide, setfindNotProvide] = useState(true);
  const [findHelp, setfindHelp] = useState([]);
  const [provideHelp, setprovideHelp] = useState([]);
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  //get user
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
  useEffect(() => {
    const fetchData = async () => {
      if (user?._id === undefined) return;
      try {
        let find = await axios.post("/api/reccomand/helpInLocal", {
          pincode: user?.pincode,
          city: user?.city,
          state: user?.state,
          uid: user?._id,
        });
        find = await find.data;
        setfindHelp(find);
      } catch (error) {
        console.log(error);
      }
      try {
        let provide = await axios.post("/api/reccomand/giveHelpInLocal", {
          pincode: user?.pincode,
          city: user?.city,
          state: user?.state,
          uid: user?._id,
        });
        provide = await provide.data;
        setprovideHelp(provide);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [user?._id, user?.city, user?.state, user?.pincode]);
  return (
    <ScrollView>
      <HeaderSign navigation={navigation} />

      <AskForHelp navigation={navigation} />
      {/* tab bar for get or provide  */}
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,
          flexDirection: "row",
          marginTop: 15,
          justifyContent: "space-evenly",
        }}
      >
        <Pressable
          onPress={() => {
            setfindNotProvide(true);
          }}
          style={findNotProvide ? styles.activeBtn : styles.normalBtn}
        >
          <Text
            style={{
              color: findNotProvide ? "#0779e4" : "black",
              textAlign: "center",
            }}
          >
            Get Help
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setfindNotProvide(false);
          }}
          style={findNotProvide ? styles.normalBtn : styles.activeBtn}
        >
          <Text
            style={{
              color: findNotProvide ? "black" : "#0779e4",
              textAlign: "center",
            }}
          >
            Provide Help
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          width: width * 0.84,
          marginLeft: width * 0.08,
          marginVertical: 10,
        }}
      >
        {findNotProvide ? (
          <FlatList
            data={findHelp}
            renderItem={({item}, i) => (
              <Post key={i} provider help={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <FlatList
            data={provideHelp}
            renderItem={({item}, i) => (
              <Post key={i} help={item} navigation={navigation} />
            )}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default SignedHome;
const styles = StyleSheet.create({
  normalBtn: {
    width: "50%",
    paddingVertical: 5,
    borderBottomColor: "#0779e4",
    borderBottomWidth: 1,
  },
  activeBtn: {
    width: "50%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 5,
    borderTopColor: "#0779e4",
    borderTopWidth: 1,
    borderRightColor: "#0779e4",
    borderRightWidth: 1,
    borderLeftColor: "#0779e4",
    borderLeftWidth: 1,
  },
});
