import Buscador from "@/app/pantalles/buscador";
import Home from "@/app/pantalles/home";
import IniciaSession from "@/app/pantalles/login";
import MyFilms from "@/app/pantalles/myFilms";
import { auth } from "@/firebaseConf";
import Ionicons from "@react-native-vector-icons/ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationIndependentTree } from "@react-navigation/native";
import React from "react";
import { Text } from "react-native";

export default function App() {
  return (
    <NavigationIndependentTree>
      <MyTabs />
    </NavigationIndependentTree>
  );
}

interface MyIconProps {
  color: string;
  size: number;
}
const Tab = createBottomTabNavigator();

function MyIcon({ color, size }: MyIconProps) {
  return <Ionicons name="menu" size={size} color={color} />;
}
function UserEmail() {
  if (auth.currentUser != null) {
    return (
      <Text style={{ margin: 10, fontWeight: "bold", fontSize: 15 }}>
        {auth.currentUser.email}
      </Text>
    );
  } else {
    return (
      <Text style={{ margin: 10, fontWeight: "bold", fontSize: 15 }}>
        No hi ha cap sessió iniciada
      </Text>
    );
  }
}

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return focused ? (
              <MyIcon color={color} size={size} />
            ) : (
              <MyIcon color={color} size={size} />
            );
          } else if (route.name === "Buscador") {
            return focused ? (
              <MyIcon color={color} size={size} />
            ) : (
              <MyIcon color={color} size={size} />
            );
          } else if (route.name === "MyFilms") {
            return focused ? (
              <MyIcon color={color} size={size} />
            ) : (
              <MyIcon color={color} size={size} />
            );
          } else if (route.name === "IniciaSession") {
            return focused ? (
              <MyIcon color={color} size={size} />
            ) : (
              <MyIcon color={color} size={size} />
            );
          }
        },
        tabBarActiveTintColor: "green", // Or any desired active tint color
        tabBarInactiveTintColor: "gray", // Or any desired inactive tint color
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ title: "Inici", headerRight: () => <UserEmail /> }}
      ></Tab.Screen>
      <Tab.Screen
        name="Buscador"
        component={Buscador}
        options={{ title: "Buscador", headerShown: false }}
      ></Tab.Screen>
      <Tab.Screen
        name="MyFilms"
        component={MyFilms}
        options={{
          title: "Les meves pel·licules",
          headerRight: () => <UserEmail />,
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="IniciaSession"
        component={IniciaSession}
        options={{ title: "Inicia sessió", headerRight: () => <UserEmail /> }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
