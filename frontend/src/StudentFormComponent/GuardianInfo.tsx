import TextInput from "../Inputs/TextInput"
import PhoneInput from "../Inputs/PhoneInput"
import EmailInput from "../Inputs/EmailInput"

export default function GuardianInfo({title, guardian, disabled, onChange}: {title: string, guardian: {firstName: string, lastName: string, phoneNumber: string, email: string}, disabled: boolean, onChange: (e:React.ChangeEvent<HTMLInputElement>) => void}) {
    return (
        <>
            <TextInput
                label={`${title} First Name:`}
                value={guardian.firstName}
                name="firstName"
                onChange={onChange}
                disabled={disabled}
            />

            <TextInput
                label={`${title} Last Name:`}
                value={guardian.lastName}
                name="lastName"
                onChange={onChange}
                disabled={disabled}
            />

            <PhoneInput
                label={`${title} Phone:`}
                value={guardian.phoneNumber}
                name="phoneNumber"
                onChange={onChange}
                disabled={disabled}
            />

            <EmailInput
                label={`${title} Email:`}
                value={guardian.email}
                name="email"
                onChange={onChange}
                disabled={disabled}
            />
        </>
    )
}