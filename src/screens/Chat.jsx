import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Dimensions,
  Text,
  View,
  Pressable,
  TextInput,
  FlatList,
  SafeAreaView,
  LogBox,
} from "react-native";
import HeaderSign from "../compo/HeaderSign";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import axios, { massageSocket, assest } from "../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import { timeToAgo } from "../someImpFun";
const { width, height } = Dimensions.get("window");
function Chat({ navigation, route }) {
  const [massages, setMassages] = useState([]);
  const [msgToSend, setmsgToSend] = useState("");
  const { roomId } = route.params;
  const [secondPerson, setsecondPerson] = useState({});
  const [room, setroom] = useState({});
  const [user, setuser] = useState(null);
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  useEffect(() => {
    const a = async () => {
      try {
        let u = await AsyncStorage.getItem("user");
        u = JSON.parse(u);
        setuser(u);
        if (u !== null) {
          if (u.active === false) {
            navigation.navigate("Suspend");
          } else if (u.emailVarify === false) {
            navigation.navigate("VarifyEmail");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    a();
  }, []);
  useEffect(() => {
    const socket = io(massageSocket);
    socket.on("connection");
    //get room data
    socket.emit("getRoom", { roomId });
    socket.on("getRoomResult", ({ room }) => {
      setroom(room);
    });
    // get all chats
    socket.emit("getAllchats", { roomId });
    socket.on("allMassages", ({ massages }) => {
      setMassages(massages);
    });
    // making it realtime
    socket.on("newMassage", ({ newMassage }) => {
      setMassages((pre) => {
        return [newMassage, ...pre];
      });
    });
    return () => {
      socket.off();
    };
  }, [roomId]);
  // getting data of second person
  useEffect(() => {
    if (room._id !== undefined) {
      const otherId =
        room?.partners[0] === user?._id ? room?.partners[1] : room?.partners[0];

      const fetchData = async () => {
        try {
          const sencond = await (
            await axios.get("/api/auth/getUserById/" + otherId)
          ).data;
          setsecondPerson(sencond.send);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }
  }, [user?._id, room?.partners]);

  //send massage
  const sendMassage = () => {
    if (msgToSend === "") return;
    setmsgToSend("");
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("sendMassage", {
      roomId,
      massage: msgToSend,
      senderId: user?._id,
      senderName: user?.name,
      senderPic: user?.profilePic,
    });
  };

  return (
    <ScrollView style={{ height: height }}>
      <HeaderSign navigation={navigation} />
      <View
        style={{
          width: width * 0.9,
          marginLeft: width * 0.05,
          flex: 1,
          flexDirection: "column",
        }}
      >
        {/* header  */}
        <AntDesign
          size={24}
          name="arrowleft"
          onPress={() => navigation.navigate("AllChat")}
          style={{ marginBottom: 15 }}
        />
        <View style={{ backgroundColor: "#0779e4", padding: 5 }}>
          <Pressable
            onPress={() =>
              navigation.navigate("Profile", {
                id: secondPerson?._id ? secondPerson?._id : "own",
              })
            }
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Avatar
              size="small"
              title={secondPerson?.username}
              source={{
                uri: secondPerson?.profilePic
                  ? assest + secondPerson?.profilePic
                  : "exa.com",
              }}
              rounded
            />
            <Text
              style={{
                fontSize: 16,
                marginLeft: 10,
                fontWeight: "700",
                color: "white",
              }}
            >
              {secondPerson?.username}
            </Text>
          </Pressable>
        </View>

        {/* main massage body  */}
        <Massages massages={massages} secondPerson={secondPerson} />

        {/* bottom massage send part  */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TextInput
            style={{
              flex: 1,
              borderColor: "black",
              borderWidth: 1,
              padding: 5,
              borderStyle: "solid",
            }}
            autoCorrect
            value={msgToSend}
            onChangeText={(msg) => setmsgToSend(msg)}
            placeholder="Write a massage"
          />
          <Ionicons
            style={{ marginLeft: 10 }}
            onPress={sendMassage}
            name="send"
            size={20}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const Massages = ({ massages, secondPerson }) => {
  return (
    <SafeAreaView style={{ height: height / 1.5, width: "100%" }}>
      <FlatList
        data={massages}
        renderItem={({ item }, i) => (
          <Msg key={i} msg={item} secondPerson={secondPerson} />
        )}
        keyExtractor={(item) => item?._id}
      />
    </SafeAreaView>
  );
};

const Msg = ({ msg, secondPerson }) => {
  const isSecondPerson = msg.doerId === secondPerson._id;

  return (
    <>
      <View style={{ width: "100%", marginVertical: 5 }}>
        <View
          style={{
            maxWidth: width * 0.5,
            backgroundColor: isSecondPerson ? "#8fbcb3" : "grey",
            marginLeft: isSecondPerson ? 0 : "auto",
          }}
        >
          <Text style={{ fontSize: 15, color: "white" }}>{msg.massage} </Text>
          <Text style={{ fontSize: 8, textAlign: "right", color: "white" }}>
            {timeToAgo(msg.time)}
          </Text>
        </View>
      </View>
    </>
  );
};

export default Chat;
