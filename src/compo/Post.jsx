import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  Dimensions,
  Image,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { Avatar } from "react-native-elements";
import { timeToAgo } from "../someImpFun";
import { Entypo } from "@expo/vector-icons";
import axios, { assest, massageSocket } from "../axios";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");
function Post({
  navigation,
  help,
  provider,
  setPosts, // help to delete it from ui in real time
}) {
  const [user, setuser] = useState({});
  const [postCreator, setpostCreator] = useState({});
  const [showMoreOption, setshowMoreOption] = useState(false);
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
      const id = provider ? help?.providerId : help?.requesterId;
      try {
        const creator = await (
          await axios.get("/api/auth/getUserById/" + id)
        ).data;
        console.log(help, creator.send);

        setpostCreator(creator.send);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [help?.providerId, help?.requesterId, provider]);

  const goToChatRoom = async () => {
    const socket = io(massageSocket);
    socket.on("connection");

    socket.emit("getRoomId", {
      userId: user?._id,
      otherId: postCreator?._id,
    });
    socket.on("roomPresent", ({ roomId }) => {
      navigation.navigate("Chat", { roomId: roomId });
    });
  };

  const deleteIt = async () => {
    const x = Alert.alert(
      "Delete this post",
      "Did you really want to delete it?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const id = help?._id;
              const url = `/api/${provider ? "provide" : "request"}/delete`;
              let d = await axios.post(url, { id: id });
              d = await d.data;
              if (d.msg === "ok") {
                Alert.alert("", d.res);
                //reload posts and deleted from ui also automatically
                setPosts((pre) => {
                  return pre.filter((x) => x._id !== help._id);
                });
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };
  return (
    <>
      <View style={{ height: 50 }}></View>
      <View
        style={{
          width: (9 * width) / 10,
          flexDirection: "column",
        }}
      >
        {/* header  */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            alignItems: "center",
            backgroundColor: "#1a73e8",
            paddingVertical: 5,
          }}
        >
          <Pressable
            onPress={() => {
              navigation.navigate("Profile", {
                id: postCreator?._id === user?._id ? "own" : postCreator?._id,
              });
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Avatar
              rounded
              size="small"
              title={postCreator?.username}
              source={{
                uri: postCreator?.profilePic
                  ? `${assest}${postCreator?.profilePic}`
                  : "example.com",
              }}
            />
            <View>
              <Text style={{ marginLeft: 10, color: "white" }}>
                {postCreator?.username}
              </Text>
              <Text style={{ marginLeft: 10, color: "white" }}>
                {timeToAgo(help?.time)}
              </Text>
            </View>
          </Pressable>
          <View style={{ position: "relative" }}>
            <Pressable
              style={{ width: 20 }}
              onPress={() => setshowMoreOption((pre) => !pre)}
            >
              <Entypo style={{ color: "white" }} name="dots-three-vertical" />
            </Pressable>
            {showMoreOption ? (
              <View
                style={{
                  backgroundColor: "#fff",
                  position: "absolute",
                  width: 60,
                  height: 85,
                  paddingLeft: 10,
                  marginTop: 25,
                  left: -20,
                }}
              >
                <Pressable
                  onPress={() => {
                    console.log("share");
                  }}
                >
                  <Text style={styles.optionText}>Share</Text>
                </Pressable>

                {user ? (
                  postCreator?._id === user?._id ? (
                    <Pressable onPress={deleteIt}>
                      <Text style={styles.optionText}>Delete</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => {
                        console.log("Report");
                      }}
                    >
                      <Text style={styles.optionText}>Report</Text>
                    </Pressable>
                  )
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
        {/* main body  */}
        <View style={{ zIndex: 0 }}>
          <Text style={{ fontSize: 15, fontWeight: "700", marginVertical: 5 }}>
            {provider
              ? `Need ${help?.name}, contact me!!!`
              : `Please help, we need ${help?.name}`}
          </Text>
          <Text>{help?.desc}</Text>
        </View>
        {/* {help?.image !== "" ? ( */}
        <Image
          style={styles.image}
          resizeMode="cover"
          source={{
            uri: `${assest}${help?.image}`,
          }}
        />
        {/* ) : null} */}
        {/* footer  */}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-evenly",
          }}
        >
          {postCreator?._id !== user?._id ? (
            <>
              <Pressable onPress={goToChatRoom} style={styles.bottomBtn}>
                <Text style={styles.bottomBtnText}>Start Chatting</Text>
              </Pressable>
              {provider ? (
                <ReqItem help={help} owner={postCreator} user={user} />
              ) : null}
            </>
          ) : null}
        </View>
      </View>
    </>
  );
}

const ReqItem = ({ owner, user, help }) => {
  const [request, setrequest] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        let req = await axios.get(
          `/api/request/isrequested/${user?._id}/${owner?._id}`
        );
        req = req.data;
        setrequest(req);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [owner?._id, user?._id]);
  const reqForItem = async () => {
    if (request.msg === "sent") {
      if (request.accept == true) {
        return;
      } else {
        Alert.alert("", "request is sent already");
        return;
      }
    } else {
      try {
        let sendReq = await axios.post("/api/request/reqmobile", {
          requesterId: user?._id,
          accepterId: owner?._id,
          postId: help?._id,
        });
        sendReq = sendReq.data;
        Alert.alert("", sendReq.res);
        setrequest({ msg: "sent", accept: false });
      } catch (error) {
        Alert.alert("", "server is temparary down!!");
      }
    }
  };
  return (
    <Pressable onPress={reqForItem} style={styles.bottomBtn}>
      {request.msg === "sent" ? (
        request.accept ? (
          <Pressable
            style={{ width: "100%", height: "100%" }}
            onPress={Linking.openURL(`tel:${owner?.mobile}`)}
          >
            <Text style={styles.bottomBtnText}>Call : {owner?.mobile}</Text>
          </Pressable>
        ) : (
          <Text style={styles.bottomBtnText}>Request Sent</Text>
        )
      ) : (
        <Text style={styles.bottomBtnText}>Request For Item</Text>
      )}
    </Pressable>
  );
};

export default Post;

const styles = StyleSheet.create({
  optionText: {
    paddingVertical: 4,
  },
  image: {
    width: "100%",
    height: 200,
    zIndex: -100,
  },
  bottomBtn: {
    backgroundColor: "#0779e4",
    color: "white",
    padding: 5,
  },
  bottomBtnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
});
