import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Platform,
  Image,
  Button,
  Picker,
  ScrollView,
} from "react-native";
import HeaderSign from "./HeaderSign";
import * as ImagePicker from "expo-image-picker";
import { checkFileSize } from "../someImpFun";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const CreateHelp = ({ navigation }) => {
  const [helpData, sethelpData] = useState({ name: "", desc: "" });
  const [image, setImage] = useState(null);
  const [select, setselect] = useState("Medical");
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
      aspect: [4, 3],
      quality: 0.1,
      base64: true,
    });
    if (!result.cancelled) {
      let res = await checkFileSize(result.uri);
      console.log(res);
      if (res.size && res.size <= 25500) setImage(result);
      else {
        Alert.alert("Large file", "File size must be less than 1MB.");
        return;
      }
    }
  };

  const submit = async () => {
    if (helpData.name === "") {
      Alert.alert("", "Name of item connot be empty.");
      return;
    }
    let imgUrl = "";
    if (image) {
      let formdata = new FormData();
      formdata.append("image", image.base64);

      try {
        let uploadImage = await axios.post(
          `/api/provide/postImage/${user?._id}`,
          formdata,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        uploadImage = await uploadImage.data;
        if (uploadImage.msg !== "ok") {
          Alert.alert(
            "Server Error",
            "Server is temprary Down, Please come again after some time!!!"
          );
          return;
        } else {
          imgUrl = uploadImage.imageUrl;
        }
      } catch (error) {
        console.log("error : ", error);
        return;
      }
    }

    const dataToSend = {
      name: helpData.name,
      type: select,
      desc: helpData.desc,
      image: imgUrl,
      ...user,
    };
    try {
      let addItem = await axios.post(
        "/api/provide/addProvidingItem",
        dataToSend
      );
      addItem = await addItem.data;

      if ((addItem.msg = "ok")) {
        Alert.alert("", addItem.res);
      } else {
        AsyncStorage.setItem("user", addItem.user);
        setuser(addItem.user);
        Alert.alert("", addItem.res);
      }
    } catch (error) {
      console.log(error);
      return;
    }

    setImage(null);
    sethelpData({ name: "", desc: "" });
  };
  return (
    <ScrollView>
      <HeaderSign navigation={navigation} />
      <View style={styles.center}>
        <View style={styles.centeredView}>
          <Text style={{ fontSize: 24, marginVertical: 10, fontWeight: "700" }}>
            Create Help
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Name of Commodity"
            value={helpData.name}
            onChangeText={(name) => {
              sethelpData((pre) => {
                return { ...pre, name: name };
              });
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
            multiline
            style={styles.input}
            value={helpData.desc}
            onChangeText={(desc) => {
              sethelpData((pre) => {
                return { ...pre, desc: desc };
              });
            }}
            placeholder="Add Desc."
          />
          <Text style={{ marginVertical: 5 }}>Choose Image</Text>
          <View style={{ marginVertical: 10 }}>
            <Button title="Choose a Image" onPress={pickImage} />
          </View>
          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{
                width: (8 * width) / 10,
                height: 200,
                marginVertical: 10,
              }}
            />
          )}
          <View style={{ height: 10 }}>
            <Button title="Add Item" onPress={submit} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 270,
  },
  center: {
    width: (9 * width) / 10,
    marginLeft: width / 20,
    height: height * 0.9,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 40,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "black",
    borderStyle: "solid",
    borderRadius: 10,
  },
  select: {
    width: "90%",
    borderColor: "black",
    color: "black",
    borderWidth: 2,
    borderStyle: "solid",
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

export default CreateHelp;
