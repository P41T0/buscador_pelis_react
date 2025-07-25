import { auth } from "@/firebaseConf";
import Ionicons from "@react-native-vector-icons/ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

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

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          return <Ionicons name="menu" color={color} size={size} />;
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        headerRight: () => <UserEmail />,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inici",
        }}
      />
      <Tabs.Screen
        name="buscador"
        options={{
          title: "Buscador",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="myFilms"
        options={{
          title: "Les meves pel·lícules",
        }}
      />
      <Tabs.Screen
        name="iniciaSession"
        options={{
          title: "Inicia sessió",
        }}
      />
    </Tabs>
  );
}
