import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import VarifyEmail from "../screens/VarifyEmail";
import Suspend from "../screens/Suspend";
import CreateHelp from "./CreateHelp";
import Profile from "../screens/Profile";
import EditProfile from "../screens/EditProfile";
import AllChat from "../screens/AllChat";
import Chat from "../screens/Chat";
import Term from "../screens/terms/Term";
import About from "../screens/terms/About";
import Privacy from "../screens/terms/Privacy";
import Contact from "../screens/terms/Contact";
import Prohibited from "../screens/terms/Prohibited";
import SignedHome from "./SignedHome";
import RequestItem from "../screens/RequestItem";
import Search from "../screens/Search";

const Stack = createStackNavigator();
function Main() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* unsigned  */}
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Signup} />

          {/* signed in  */}
          <Stack.Screen name="SignHome" component={SignedHome} />
          <Stack.Screen name="CreateHelp" component={CreateHelp} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="AllChat" component={AllChat} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="RequestItem" component={RequestItem} />
          <Stack.Screen name="Search" component={Search} />

          {/* sign in varify email  */}
          <Stack.Screen name="VarifyEmail" component={VarifyEmail} />

          {/* sign in but suspended  */}
          <Stack.Screen name="Suspend" component={Suspend} />

          {/* everywhere  */}
          <Stack.Screen name="Term And Conditions" component={Term} />
          <Stack.Screen name="About Us" component={About} />
          <Stack.Screen name="Privacy Policy" component={Privacy} />
          <Stack.Screen name="Contact Us" component={Contact} />
          <Stack.Screen name="Prohibited Items" component={Prohibited} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default Main;
