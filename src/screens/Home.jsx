import React, { useEffect, useState } from "react";
import UnSignHome from "../compo/UnSignHome";
import Header from "../compo/Header";
import { Dimensions, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
function Home({ navigation }) {
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
          } else navigation.navigate("SignHome");
        }
      } catch (error) {
        console.log(error);
      }
    };
    a();
  }, []);
  // console.warn(user);

  return (
    <ScrollView
      style={{
        height: height,
        backgroundColor: "white",
      }}
    >
      <Header navigation={navigation} />
      <UnSignHome navigation={navigation} />
    </ScrollView>
  );
}

export default Home;
