import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import HeaderSign from "../compo/HeaderSign";
import Post from "../compo/Post";
import axios from "../axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

function Request({ navigation }) {
  const [get, setget] = useState({ pending: [], accepted: [] });
  const [did, setdid] = useState({ pending: [], accepted: [] });
  const [user, setuser] = useState(null);
  const [findNotProvide, setfindNotProvide] = useState(true);

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
    async function fetchData() {
      try {
        const allget = await (
          await axios.get("/api/request/allreqget/" + user?._id)
        ).data;
        const alldid = await (
          await axios.get("/api/request/allreqdid/" + user?._id)
        ).data;
        let pending = allget.filter((x) => x.accept === false);
        let accepted = allget.filter((x) => x.accept === true);
        setget({ pending: pending, accepted: accepted });
        pending = alldid.filter((x) => x.accept === false);
        accepted = alldid.filter((x) => x.accept === true);
        setdid({ pending: pending, accepted: accepted });
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [user?._id]);
  return (
    <View>
      <HeaderSign navigation={navigation} />

      {/* owner all help and needs */}
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
            Request You Get
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
            Request You Did
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
          <>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                Pending :-
              </Text>
              {get.pending.length ? (
                <FlatList
                  data={get.pending}
                  renderItem={(item, i) => (
                    <ReqGet
                      key={i}
                      pending
                      user={user}
                      requesterId={item.requesterId}
                      postId={item.postId}
                      setReq={setget}
                    />
                  )}
                  keyExtractor={(item) => item?._id}
                />
              ) : (
                <Text> No pending request remaining. </Text>
              )}
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                Accepted :-
              </Text>
              {get.accepted.length ? (
                <FlatList
                  data={get.accepted}
                  renderItem={(item, i) => (
                    <ReqGet
                      key={i}
                      user={user}
                      requesterId={item.requesterId}
                      postId={item.postId}
                      setReq={setget}
                    />
                  )}
                  keyExtractor={(item) => item?._id}
                />
              ) : (
                <Text> You have not accepted any request yet. </Text>
              )}
            </View>
          </>
        ) : (
          <>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                Pending :-
              </Text>
              {did.pending.length ? (
                <FlatList
                  data={did.pending}
                  renderItem={(item, i) => (
                    <ReqDid
                      key={i}
                      pending
                      user={user}
                      accepterId={item.accepterId}
                      postId={item.postId}
                      setReq={setdid}
                    />
                  )}
                  keyExtractor={(item) => item?._id}
                />
              ) : (
                <Text> No pending request remaining. </Text>
              )}
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: "700" }}>
                Accepted :-
              </Text>
              {did.accepted.length ? (
                <FlatList
                  data={did.accepted}
                  renderItem={(item, i) => (
                    <ReqDid
                      key={i}
                      user={user}
                      accepterId={item.accepterId}
                      postId={item.postId}
                      setReq={setdid}
                    />
                  )}
                  keyExtractor={(item) => item?._id}
                />
              ) : (
                <Text> You have not accepted any request yet. </Text>
              )}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const ReqGet = ({ navigation, pending, requesterId, postId, user, setReq }) => {
  const [requester, setrequester] = useState({});
  const [post, setpost] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const creator = await (
          await axios.get("/api/auth/getUserById/" + requesterId)
        ).data;
        setrequester(creator.send);
        const post = await (
          await axios.get("/api/provide/OneProviding/" + postId)
        ).data;
        setpost(post);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [requesterId, postId]);

  const acceptReq = async () => {
    try {
      let accept = await axios.post("/api/request/acceptReq", {
        requesterId,
        accepterId: user?._id,
        postId,
      });
      accept = accept.data;
      if (accept.msg === "ok") {
        Alert.alert("", accept.res);
        // reload();
      }
    } catch (error) {
      Alert.alert("", error.massage);
    }
  };
  const deleteIt = async () => {
    try {
      let accept = await axios.post("/api/request/deleteReq", {
        requesterId,
        accepterId: user?._id,
        postId,
      });
      accept = accept.data;
      if (accept.msg === "ok") {
        Alert.alert("", accept.res);
        // reload();
        setReq((pre) => {
          //which one to set
          if (pending) {
            return {
              ...pre,
              pending: pre.pending.filter((x) => x.postId !== postId),
            };
          } else {
            return {
              ...pre,
              accepted: pre.accepted.filter((x) => x.postId !== postId),
            };
          }
        });
      }
    } catch (error) {
      Alert.alert("", error.massage);
    }
  };
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 5,
          marginHorizontal: 10,
          alignItems: "center",
        }}
      >
        <Avatar
          title={requester?.username[0]}
          source={{
            uri: requester?.profilePic
              ? assest + requester?.profilePic
              : "exa.com",
          }}
        />
        <Text className="mx-3">
          <Pressable
            onPress={() => navigation.navigate("Profile", { id: requesterId })}
          >
            <Text style={{ fontWeight: "700" }}>{requester?.username}</Text>
          </Pressable>{" "}
          {pending ? (
            <> have sent you request for {post?.name}. </>
          ) : (
            <>
              have sent you request for {post?.name}, and you accepted. <br />
              <Pressable
                onPress={() => Linking.openURL(`tel:${requester.mobile}`)}
              >
                <Text style={{ fontWeight: "700" }}> {requester?.mobile}</Text>
              </Pressable>{" "}
              is mobile number of user who requested.
            </>
          )}
        </Text>

        <Post provider help={post} navigation={navigation} />

        {pending ? (
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Button onClick={acceptReq} title="Accept" />
            <Button onClick={deleteIt} title="Delete" />
          </View>
        ) : null}
      </View>
    </>
  );
};

const ReqDid = ({ pending, accepterId, user, postId, navigation, setReq }) => {
  const [accepter, setaccepter] = useState({});
  const [post, setpost] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const creator = await (
          await axios.get("/api/auth/getUserById/" + accepterId)
        ).data;
        setaccepter(creator.send);
        const post = await (
          await axios.get("/api/provide/OneProviding/" + postId)
        ).data;
        setpost(post);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [accepterId]);
  const deleteIt = async () => {
    try {
      let accept = await axios.post("/api/request/deleteReq", {
        requesterId: user?._id,
        accepterId,
        postId,
      });
      accept = accept.data;
      if (accept.msg === "ok") {
        Alert.alert("", accept.res);
        // reload();
        setReq((pre) => {
          //which one to set
          if (pending) {
            return {
              ...pre,
              pending: pre.pending.filter((x) => x.postId !== postId),
            };
          } else {
            return {
              ...pre,
              accepted: pre.accepted.filter((x) => x.postId !== postId),
            };
          }
        });
      }
    } catch (error) {
      Alert.alert("", error.massage);
    }
  };
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 5,
          marginHorizontal: 10,
          alignItems: "center",
        }}
      >
        <Avatar
          title={accepter?.username[0]}
          source={{
            uri: accepter?.profilePic
              ? assest + accepter?.profilePic
              : "exa.com",
          }}
        />
        <Text className="mx-3">
          <Pressable
            onPress={() => navigation.navigate("Profile", { id: accepterId })}
          >
            <Text style={{ fontWeight: "700" }}>{accepter?.username}</Text>
          </Pressable>{" "}
          {pending ? (
            <>
              You have sent you request for {post?.name} to{" "}
              <Pressable
                onPress={() =>
                  navigation.navigate("Profile", { id: accepterId })
                }
              >
                <Text style={{ fontWeight: "700" }}>{accepter?.username}</Text>
              </Pressable>{" "}
              .
            </>
          ) : (
            <>
              You have requested for {post?.name} to{" "}
              <Pressable
                onPress={() =>
                  navigation.navigate("Profile", { id: accepterId })
                }
              >
                <Text style={{ fontWeight: "700" }}>{accepter?.username}</Text>
              </Pressable>{" "}
              , and{" "}
              <Pressable
                onPress={() =>
                  navigation.navigate("Profile", { id: accepterId })
                }
              >
                <Text style={{ fontWeight: "700" }}>
                  {accepter?.username + " "}
                </Text>
              </Pressable>
              accepted. <br />
              <Pressable
                onPress={() => Linking.openURL(`tel:${accepter.mobile}`)}
              >
                <Text style={{ fontWeight: "700" }}> {accepter?.mobile}</Text>
              </Pressable>{" "}
              is mobile number of {accepter?.username}.
            </>
          )}
        </Text>

        <Post provider help={post} navigation={navigation} />

        {pending ? (
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Button onClick={acceptReq} title="Accept" />
            <Button onClick={deleteIt} title="Delete" />
          </View>
        ) : null}
      </View>

      {pending ? (
        <View className="mt-2">
          <button onClick={deleteIt} className="btn btn-primary">
            Remove Request
          </button>
        </View>
      ) : null}
    </>
  );
};

export default Request;

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
