import LoginForm from "@/components/compound-components/login-form";
import { View } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <LoginForm size="md" />
        </View>
    );
}
