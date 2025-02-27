import TextInput from "../InputComponents/TextInput";
import PhoneInput from "../InputComponents/PhoneInput";
import EmailInput from "../InputComponents/EmailInput";

interface GuardianInfoProps {
    guardian: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
    };
    disabled: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function GuardianInfo({guardian, disabled, onChange}: GuardianInfoProps) {
    return (
        <>
            <TextInput
                label={`First Name:`}
                value={guardian.firstName}
                name="firstName"
                onChange={onChange}
                disabled={disabled}
            />

            <TextInput
                label={`Last Name:`}
                value={guardian.lastName}
                name="lastName"
                onChange={onChange}
                disabled={disabled}
            />

            <PhoneInput
                label={`Phone Number:`}
                value={guardian.phoneNumber}
                name="phoneNumber"
                onChange={onChange}
                disabled={disabled}
            />

            <EmailInput
                label={`Email:`}
                value={guardian.email}
                name="email"
                onChange={onChange}
                disabled={disabled}
            />
        </>
    );
}
