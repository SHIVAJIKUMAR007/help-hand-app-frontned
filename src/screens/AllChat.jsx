import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import HeaderSign from "../compo/HeaderSign";
import { timeToAgo } from "../someImpFun";
import axios, { assest, massageSocket } from "../axios";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
function AllChat({ navigation }) {
  const [rooms, setrooms] = useState([]);
  const [user, setuser] = useState(null);

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
    socket.emit("getRooms", { uid: user?._id });
    socket.on("getAllRooms", ({ rooms }) => {
      setrooms(rooms);
    });
    //updating new room created in real time
    socket.on("newRoomAdded", ({ newRoom }) => {
      setrooms((pre) => {
        pre = [newRoom, ...pre];
      });
    });

    return () => {
      socket.off();
    };
  }, [user?._id]);

  return (
    <SafeAreaView>
      <HeaderSign navigation={navigation} />
      <View style={{ width: width * 0.84, marginLeft: width * 0.08 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 15,
          }}
        >
          Chat
        </Text>
        <FlatList
          data={rooms}
          renderItem={({ item }, i) => (
            <Oneroom
              key={i}
              navigation={navigation}
              room1={item}
              user={user}
              setRooms={setrooms}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const Oneroom = ({ navigation, room1, setRooms, user }) => {
  const [room, setroom] = useState(room1);
  const [newMassage, setnewMassage] = useState(0);
  const [secondPerson, setsecondPerson] = useState({});
  useEffect(() => {
    if (room1._id !== undefined) {
      const otherId =
        room1?.partners[0] === user?._id
          ? room1?.partners[1]
          : room1?.partners[0];
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
  }, [user?._id, room1?._id]);

  useEffect(() => {
    const socket = io(massageSocket);
    socket.on("connection");
    socket.emit("joinChatRoom", { roomId: room?._id });
    // updating lastmassage in realtime
    socket.on("lastMassageUpdated", ({ lastMassage, lastMassageTime }) => {
      setroom((pre) => {
        return {
          ...pre,
          lastMassage,
          lastMassageTime,
        };
      });
      setnewMassage((pre) => pre + 1);
      setRooms((pre) => {
        const res = pre.find((x) => x._id === room._id);
        res.lastMassage = lastMassage;
        res.lastMassageTime = lastMassageTime;
        pre.sort((a, b) => {
          return Date.parse(b.lastMassgeTime) - Date.parse(a.lastMassgeTime);
        });
        return pre;
      });
    });
    return () => {
      socket.off();
    };
  }, [room, setRooms]);

  return (
    <>
      <Pressable
        style={{
          width: "100%",
          paddingVertical: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onPress={() =>
          navigation.navigate("Chat", {
            roomId: room?._id,
          })
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            size="small"
            title={secondPerson?.username}
            source={{
              uri: secondPerson?.profilePic
                ? assest + secondPerson?.profilePic
                : "example.com",
            }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontWeight: "700" }}>{secondPerson?.username}</Text>
            {room?.lastMassage ? <Text> {room?.lastMassage}</Text> : null}

            {room?.lastMassage ? (
              <Text>{timeToAgo(room?.lastMassageTime)}</Text>
            ) : null}
          </View>
        </View>
        {newMassage ? <Text style={{ fontSize: 16 }}>{newMassage}</Text> : null}
      </Pressable>
    </>
  );
};

export default AllChat;
