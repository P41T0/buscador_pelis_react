import { auth } from "@/firebaseConf";
import React from "react";
import { Text } from "react-native";
export default function UserEmail() {
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
