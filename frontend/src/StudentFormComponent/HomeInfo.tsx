import TextInput from "../Inputs/TextInput"
import { Student, HomeKeys } from "../types"

export default function HomeInfo({home, handleHomeChange, disabled}: {home: Student["home"], handleHomeChange: (field: HomeKeys) => (e: React.ChangeEvent<HTMLInputElement>) => void, disabled: boolean}){
    const titleMap: Record<HomeKeys, string> = {
        "streetAddress": "Street Address:",
        "city": "City",
        "zipCode": "Zip Code"
    }
    return (
        <>
            {
                Object.entries(titleMap).map(([key, value]) => {
                    return (
                        <TextInput
                            key={key}
                            label={value}
                            value={home[key as HomeKeys]}
                            onChange={handleHomeChange(key as HomeKeys)}
                            disabled={disabled}
                        />)
                    })
            }
        </>
    )
}