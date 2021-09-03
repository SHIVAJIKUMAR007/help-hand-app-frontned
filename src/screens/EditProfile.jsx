import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Text,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import HeaderSign from "../compo/HeaderSign";
import { Avatar } from "react-native-elements";
import { Entypo, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { assest } from "../axios";
import { checkFileSize } from "../someImpFun";

const { width, height } = Dimensions.get("window");

function EditProfile({ navigation }) {
  const [image, setImage] = useState(null);
  const [info, setinfo] = useState({});
  const [isUsernameUnique, setisUsernameUnique] = useState(2);
  const [isEmailUnique, setisEmailUnique] = useState(2);
  //get user
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
        setinfo({
          uid: u?._id,
          username: u?.username,
          email: u?.email,
          bio: u?.bio,
          mobile: u?.mobile.toString(),
          city: u?.city,
          state: u?.state,
          pincode: u?.pincode,
          country: u?.country,
        });
      } catch (error) {
        console.log(error);
      }
    };
    a();
  }, []);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.1,
      base64: true,
    });
    if (!result.cancelled) {
      let res = await checkFileSize(result.uri);
      if (res.size && res.size <= 25500) setImage(result);
      else {
        Alert.alert("Large file", "File size must be less than 1MB.");
        return;
      }
    }
  };

  const chanageProfilePic = async () => {
    if (image) {
      let formdata = new FormData();
      formdata.append("profilePic", image.base64);

      try {
        let uploadImage = await axios.post(
          "/api/auth/updateProfilePic/" + user?._id,
          formdata,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        uploadImage = await uploadImage.data;
        if (uploadImage.msg === "ok") {
          Alert.alert("", "Profile Picture is updated.");
          let u = await AsyncStorage.getItem("user");
          u = JSON.parse(u);
          let newuser = { ...u, profilePic: uploadImage.profilePic };
          console.warn(newuser);
          await AsyncStorage.setItem("user", JSON.stringify(newuser));
        } else {
          Alert.alert("", uploadImage.msg);
        }
      } catch (error) {
        console.log("error : ", error);
        return;
      }
    } else {
      return;
    }
  };

  const checkUsername = async (u) => {
    setisUsernameUnique(1);
    if (u === user?.username) {
      setisUsernameUnique(2);
      return;
    }
    try {
      let check = await (
        await axios.get(`/api/auth/usernameExists/${u ? u : "shivaji"}`)
      ).data;
      if (check.err) setisUsernameUnique(-1);
      else setisUsernameUnique(2);
    } catch (error) {
      console.warn(error);
      setisUsernameUnique(1);
    }
  };
  const checkEmail = async (email) => {
    setinfo((pre) => {
      return {
        ...pre,
        email: email,
      };
    });
    if (email === user?.email) {
      setisEmailUnique(2);
      return;
    }
    let validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    setisEmailUnique(1);
    if (!email.match(validRegex)) {
      setisEmailUnique(3);
      return;
    }
    try {
      let check = await (
        await axios.get(
          `/api/auth/emailExists/${email ? email : "shivaji@gmail.com"}`
        )
      ).data;
      if (check.err) setisEmailUnique(-1);
      else setisEmailUnique(2);
    } catch (error) {
      console.warn(error);
      setisEmailUnique(1);
    }
  };

  const updateData = async () => {
    if (info.username === "" || info.email === "") {
      Alert.alert("", "Username or email empty.");
      return;
    }
    if (isEmailUnique !== 2 || isUsernameUnique !== 2) {
      Alert.alert(
        "",
        "Username or email is already registered. Please Choose unique username and email."
      );
      return;
    }
    if (
      info.city == "" ||
      info.state == "" ||
      info.country == "" ||
      info.pincode == ""
    ) {
      Alert.alert("Fill correct address", "Address Field cannot be empty");
      return;
    }
    if (info.mobile == null) {
      Alert.alert("Fill Mobile number", "Mobile number cannot be empty");
      return;
    }
    try {
      let update = await axios.post("/api/auth/updateRestData", info);
      update = await update.data;
      if (update.msg === "ok") {
        Alert.alert("", "Your data is updated!!!");
        let u = { ...user, ...info };
        setuser(u);
        await AsyncStorage.setItem("user", JSON.stringify(u));
      } else {
        Alert.alert("", "Server is temprerory down!!!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <HeaderSign navigation={navigation} />
      {/* profile pic change  */}
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          width: width * 0.9,
          marginLeft: width * 0.05,
        }}
      >
        <View style={{ position: "relative" }}>
          <Avatar
            rounded
            size="xlarge"
            title={user?.username}
            source={{
              uri: image ? image.uri : `${assest}${user?.profilePic}`,
            }}
          />

          <Entypo
            style={{ position: "absolute", top: "80%", left: "20%" }}
            name="camera"
            onPress={pickImage}
            size={24}
          />
        </View>
        <View style={styles.changePicBtn}>
          <Button onPress={chanageProfilePic} title="Change Profile pick" />
        </View>

        {/* <Image
          style={{ width: 200, height: 200 }}
          source={{
            uri: image ? image.uri : `${assest}${user?.profilePic}`,
          }}
        /> */}

        {/* change details  */}
        <Text style={{ fontSize: 24, fontWeight: "700", marginVertical: 15 }}>
          Personal Details
        </Text>
        <View
          style={{ width: "90%", flexDirection: "row", alignItems: "center" }}
        >
          <TextInput
            style={styles.input}
            // minLength={6}
            autoCompleteType="username"
            value={info?.username}
            onChangeText={(u) => {
              setinfo((pre) => {
                return {
                  ...pre,
                  username: u,
                };
              });
              checkUsername(u);
            }}
            placeholder="Username"
          />
          <Loader val={isUsernameUnique} />
        </View>
        <View
          style={{ width: "90%", flexDirection: "row", alignItems: "center" }}
        >
          <TextInput
            style={styles.input}
            autoCompleteType="email"
            value={info?.email}
            onChangeText={checkEmail}
            placeholder="Email"
          />
          <Loader val={isEmailUnique} />
        </View>
        <TextInput
          multiline
          style={styles.input}
          value={info?.bio}
          onChangeText={(bio) => {
            setinfo((pre) => {
              return { ...pre, bio };
            });
          }}
          placeholder="Bio"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          autoCompleteType="tel"
          value={info?.mobile?.toString()}
          onChange={(mobile) => {
            setinfo((pre) => {
              return { ...pre, mobile: mobile?.toString() };
            });
          }}
          placeholder="Mobile No."
        />
        <TextInput
          style={styles.input}
          value={info?.city}
          onChangeText={(city) => {
            setinfo((pre) => {
              return { ...pre, city };
            });
          }}
          placeholder="city"
        />
        <TextInput
          style={styles.input}
          value={info?.state}
          onChangeText={(state) => {
            setinfo((pre) => {
              return { ...pre, state };
            });
          }}
          placeholder="State"
        />
        <TextInput
          style={styles.input}
          value={info?.country}
          onChangeText={(country) => {
            setinfo((pre) => {
              return { ...pre, country };
            });
          }}
          placeholder="Country"
        />
        <TextInput
          style={styles.input}
          autoCompleteType="postal-code"
          keyboardType="numeric"
          value={info?.pincode?.toString()}
          onChangeText={(pincode) => {
            setinfo((pre) => {
              return { ...pre, pincode: pincode?.toString() };
            });
          }}
          placeholder="Pin Code"
        />
        <View style={{ marginVertical: 10 }}>
          <Button onPress={updateData} title="Update Data" />
        </View>

        {/* change pass  */}
        <ChangePass user={user} />
      </View>
    </ScrollView>
  );
}

const ChangePass = ({ user }) => {
  const [pass, setpass] = useState({
    currentPassword: "",
    newPassword: "",
  });

  async function handleSubmit() {
    if (pass.currentPassword.length < 6 || pass.newPassword.length < 6) {
      Alert.alert("Short password", "password must be atlest 6 charactor long");
    }
    if (pass.currentPassword === pass.newPassword) {
      Alert.alert("", "new password is same to the current password");
    } else {
      try {
        let updatePass = await axios.post("/api/auth/updatePassword", {
          ...pass,
          uid: user?._id,
        });
        updatePass = updatePass.data;
        if (updatePass.msg === "ok")
          Alert.alert("", "Your password is updated successfully");
      } catch (error) {
        console.log(error);
      }
      setpass({ currentPassword: "", newPassword: "" });
    }
  }
  return (
    <>
      <Text style={{ fontSize: 24, fontWeight: "700", marginVertical: 15 }}>
        Change Password
      </Text>

      <TextInput
        secureTextEntry
        style={styles.input}
        autoCompleteType="password"
        autoCorrect={false}
        value={pass.currentPassword}
        onChangeText={(oldPass) => {
          setpass((pre) => {
            return { ...pre, currentPassword: oldPass };
          });
        }}
        placeholder="Old Password"
      />
      <TextInput
        secureTextEntry
        style={styles.input}
        autoCompleteType="password"
        autoCorrect={false}
        value={pass.newPassword}
        onChangeText={(newpass) => {
          setpass((pre) => {
            return { ...pre, newPassword: newpass };
          });
        }}
        placeholder="New Password"
      />
      <View style={{ marginVertical: 10 }}>
        <Button onPress={handleSubmit} title="Change Pass" />
      </View>
    </>
  );
};

const Loader = ({ val }) => {
  return (
    <>
      {val === 0 ? null : val === 1 ? (
        <Feather name="loader" color="black" size={20} />
      ) : val === 2 ? (
        <Feather name="check" color="green" size={20} />
      ) : val === 3 ? (
        <>
          <Text style={{ color: "orange" }}> Not a Email </Text>
        </>
      ) : (
        <Entypo name="cross" color="red" size={20} />
      )}
    </>
  );
};
export default EditProfile;

const styles = StyleSheet.create({
  changePicBtn: {
    marginVertical: 10,
  },
  input: {
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
    marginVertical: 5,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderStyle: "solid",
    borderRadius: 7,
  },
});
