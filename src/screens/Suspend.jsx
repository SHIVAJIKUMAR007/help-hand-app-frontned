import React from "react";
import { Button, Text, View, Dimensions, Linking } from "react-native";
import HeaderSignButIncom from "../compo/HeaderSignButIncom";
const { width, height } = Dimensions.get("window");

function Suspend({ navigation }) {
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
  return (
    <>
      <View>
        <HeaderSignButIncom suspend navigation={navigation} />
        <View
          style={{
            height: height - (15 * height) / 100,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "700" }}>
              Your account is suspended. {"\n"}
            </Text>

            <Text>
              You have break help hand rule multiple {"\n"}time. If you think
              this is a mistake feel{"\n"} free to mail us
            </Text>

            <Button
              style={{ width: 200 }}
              title="Mail Us"
              onPress={() => {
                Linking.openURL("mailto:support@example.com");
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
}

export default Suspend;
