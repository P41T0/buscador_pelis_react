import UserEmail from "@/components/UserEmail";
import { Stack } from "expo-router";
import React from "react";

export default function BuscadorLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => <UserEmail />,
      }}
    />
  );
}
