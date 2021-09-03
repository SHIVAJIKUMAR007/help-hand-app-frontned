import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  Dimensions,
  Pressable,
  StyleSheet,
  FlatList,
  LogBox,
  SafeAreaView,
} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import axios, { assest, massageSocket } from "../axios";
import HeaderSign from "../compo/HeaderSign";
import { Entypo } from "@expo/vector-icons";
import io from "socket.io-client";
import Post from "../compo/Post";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

function Profile({ navigation, route }) {
  const { id } = route.params;
  const [owner, setowner] = useState({});
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
      if (id !== "own") {
        try {
          const own = await (
            await axios.get("/api/auth/getUserById/" + id)
          ).data;
          setowner(own.send);
        } catch (error) {
          console.log(error);
        }
      } else {
        setowner(user);
      }
    };
    fetchData();
  }, [id, user]);

  useEffect(() => {
    const fetchData = async () => {
      if (owner?._id === undefined) return;

      try {
        let find = await axios.get("/api/request/allRequests/" + owner?._id);
        find = await find.data;
        setfindHelp(find);
        let provide = await axios.get(
          "/api/provide/allProviding/" + owner?._id
        );
        provide = await provide.data;
        setprovideHelp(provide);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [owner?._id]);

  const goToChatRoom = async () => {
    const socket = io(massageSocket);
    socket.on("connection");

    socket.emit("getRoomId", {
      userId: user?._id,
      otherId: owner?._id,
    });
    socket.on("roomPresent", ({ roomId }) => {
      navigation.navigate("Chat", { roomId });
    });
  };
  return (
    <ScrollView>
      <HeaderSign navigation={navigation} />
      <View style={{ width: width * 0.9, marginLeft: width * 0.05 }}>
        <View>
          <Text style={{ fontSize: 25, fontWeight: "700", marginBottom: 20 }}>
            {id === "own" ? "My Profile" : "Profile"}
          </Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              source={{
                uri: owner?.profilePic
                  ? assest + owner?.profilePic
                  : "example.com",
              }}
              title={owner?.username}
              rounded
              size="large"
            />
            <View>
              <Text
                style={{ textAlign: "right", fontSize: 18, fontWeight: "700" }}
              >
                {owner?.username}
              </Text>
              <Text
                style={{ textAlign: "right", fontSize: 18, fontWeight: "700" }}
              >
                {owner?.email}
              </Text>
            </View>
          </View>
          <View>
            <Text>{owner?.bio}</Text>
            <Text>{"\n"}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <Entypo size={20} name="location-pin" />
              <Text>
                {" " + owner?.city}, {owner?.state}-{owner?.pincode}
              </Text>
            </View>
            <Text>{"\n"}</Text>
            {user ? (
              id === "own" ? (
                <Button
                  onPress={() => {
                    navigation.navigate("EditProfile");
                  }}
                  title="Edit Profile"
                />
              ) : (
                <View className="d-flex">
                  <Button onPress={goToChatRoom} title=" Start Chatting " />
                </View>
              )
            ) : null}
          </View>
        </View>
        {/* owner all help and needs */}
        <View
          style={{
            width: width * 0.9,
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
            width: "100%",
            marginVertical: 10,
          }}
        >
          {findNotProvide ? (
            <FlatList
              data={findHelp}
              renderItem={({ item }, i) => (
                <Post key={i} help={item} navigation={navigation} />
              )}
              keyExtractor={(item) => item._id}
            />
          ) : (
            <FlatList
              data={provideHelp}
              renderItem={({ item }, i) => (
                <Post key={i} provider help={item} navigation={navigation} />
              )}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

export default Profile;
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
