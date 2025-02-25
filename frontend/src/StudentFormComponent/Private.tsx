export default function Private() {
    const handleHomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            home: {
                ...formData["home"],
                [e.target.name]: e.target.value,
            },
        });
    };

    const handleGuardianChange = (guardian: "guardian1" | "guardian2") => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({
                ...formData,
                [guardian]: {
                    ...formData[guardian],
                    [e.target.name]: e.target.value,
                },
            });
        };
    };
    
    return (
        <>
            <h2 className="text-xl font-bold underline"> Home </h2>
            <div className="grid grid-cols-4 gap-4">
                <HomeInfo
                    home={formData["home"]}
                    handleHomeChange={handleHomeChange}
                    disabled={disabled}
                />
            </div>

            <h2 className="text-xl font-bold underline"> Guardian 1 </h2>
            <div className="grid grid-cols-4 gap-4">
                <GuardianInfo
                    guardian={formData["guardian1"]}
                    onChange={handleGuardianChange("guardian1")}
                    disabled={disabled}
                />
            </div>

            <h2 className="text-xl font-bold underline"> Guardian 2 </h2>
            <div className="grid grid-cols-4 gap-4">
                <GuardianInfo
                    guardian={formData["guardian2"]}
                    onChange={handleGuardianChange("guardian2")}
                    disabled={disabled}
                />
            </div>
        </>
    )
}