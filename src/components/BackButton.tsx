import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PRIMARY_COLOR } from "@constants/colors";
import { useRouter } from "expo-router";

export default function BackButton() {
    const router = useRouter();

    return (
        <View
            style={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 999, // stays above header
            }}
        >
            <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 5,
                }}
            >
                <Ionicons name="arrow-back" size={24} color={PRIMARY_COLOR} />
            </TouchableOpacity>
        </View>
    );
}
