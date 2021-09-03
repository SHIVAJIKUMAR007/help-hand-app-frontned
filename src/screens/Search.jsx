import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "../axios";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, View } from "react-native";
import HeaderSign from "../compo/HeaderSign";
import Post from "../compo/Post";
function Search({ navigation, route }) {
  const [user, setuser] = useState(null);
  const [searchResults, setsearchResults] = useState([]);
  const { type, toSearch, city } = route.params;
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
      try {
        let d = await axios.post("/api/search/search", {
          uid: user?._id,
          type: type,
          searchTerm: toSearch,
          city: city ? city : user?.city,
        });

        d = await d.data;

        if (d.msg === "banned") {
          AsyncStorage.setItem("user", d.user);
          setuser(d.user);
          Alert.alert(d.res);
          navigation.goBack();
        } else {
          console.warn(d.res);
          setsearchResults(d.res);
        }
      } catch (error) {
        console.log(error);
        navigation.goBack();
      }
    };
    fetchData();
  }, [user?._id, user?.city, toSearch, city, type]);
  return (
    <SafeAreaView>
      <HeaderSign navigation={navigation} />
      {/* <Text>
        {" "}
        {toSearch} {type} {city}{" "}
      </Text> */}
      <FlatList
        data={searchResults}
        renderItem={(search, i) => (
          <Post key={i} provider help={search} setPosts={setsearchResults} />
        )}
        keyExtractor={(item) => item?._id}
      />
    </SafeAreaView>
  );
}

export default Search;
