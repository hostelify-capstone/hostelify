import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Avoids the "component hasn't mounted yet" warning by redirecting after mount
    router.replace("/auth/login");
  }, []);

  return <View />;
}