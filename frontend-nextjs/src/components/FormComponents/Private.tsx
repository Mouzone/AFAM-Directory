import { StudentPrivateInfo } from "../../types";
import HomeInfo from "./HomeInfo";
import GuardianInfo from "./GuardianInfo";
import PhoneInput from "../InputComponents/PhoneInput";
import EmailInput from "../InputComponents/EmailInput";
interface PrivateProps {
    disabled: boolean;
    privateData: StudentPrivateInfo;
    setPrivateData: React.Dispatch<React.SetStateAction<StudentPrivateInfo>>;
}

export default function Private({
    disabled,
    privateData,
    setPrivateData,
}: PrivateProps) {
    const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrivateData({
            ...privateData,
            home: {
                ...privateData["home"],
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleGuardianChange = (guardian: "guardian1" | "guardian2") => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setPrivateData({
                ...privateData,
                [guardian]: {
                    ...privateData[guardian],
                    [e.target.name]: e.target.value,
                },
            });
        };
    };

    return (
        <div className="flex flex-col gap-4 w-4xl max-h-[250px] overflow-y-auto content-padding">
            <div className="flex gap-4">
                <PhoneInput
                    label="Phone Number:"
                    value={privateData.phoneNumber}
                    name="phoneNumber"
                    onChange={(e) =>
                        setPrivateData({
                            ...privateData,
                            phoneNumber: e.target.value,
                        })
                    }
                    disabled={disabled}
                />

                <EmailInput
                    label="Email:"
                    value={privateData.email}
                    name="email"
                    onChange={(e) =>
                        setPrivateData({
                            ...privateData,
                            email: e.target.value,
                        })
                    }
                    disabled={disabled}
                />
            </div>

            <h2 className="text-xl font-bold underline"> Home </h2>
            <div className="flex gap-4">
                <HomeInfo
                    home={privateData["home"]}
                    handleHomeChange={handleHomeChange}
                    disabled={disabled}
                />
            </div>

            <h2 className="text-xl font-bold underline"> Guardian 1 </h2>
            <div className="flex gap-4">
                <GuardianInfo
                    guardian={privateData["guardian1"]}
                    onChange={handleGuardianChange("guardian1")}
                    disabled={disabled}
                />
            </div>

            <h2 className="text-xl font-bold underline"> Guardian 2 </h2>
            <div className="flex gap-4">
                <GuardianInfo
                    guardian={privateData["guardian2"]}
                    onChange={handleGuardianChange("guardian2")}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
