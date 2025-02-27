import TextInput from "../InputComponents/TextInput";
import { StudentPrivateInfo, HomeKeys } from "../../types";

interface HomeInfoProps {
    home: StudentPrivateInfo["home"];
    handleHomeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}

export default function HomeInfo({home, handleHomeChange, disabled}: HomeInfoProps) {
    const titleMap: Record<HomeKeys, string> = {
        streetAddress: "Street Address:",
        city: "City",
        zipCode: "Zip Code",
    };
    return (
        <>
            {Object.entries(titleMap).map(([key, value]) => {
                return (
                    <TextInput
                        key={key}
                        label={value}
                        value={home[key as HomeKeys]}
                        name={key}
                        onChange={handleHomeChange}
                        disabled={disabled}
                    />
                );
            })}
        </>
    );
}
