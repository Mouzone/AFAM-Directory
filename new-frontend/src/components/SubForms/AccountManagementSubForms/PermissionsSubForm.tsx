export default function PermissionsSubForm({ staff, setStaff }) {
    return (
        <form>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Permissions</legend>
                <div className="join join-vertical bg-base-100">
                    {Object.entries(staff).map(([staffId, staffData]) => (
                        <div
                            key={staffId}
                            className="collapse collapse-arrow join-item border-base-300 border"
                        >
                            <input type="radio" name="my-accordion-4" />
                            <div className="collapse-title font-semibold">
                                {`${staffData["First Name"]} ${staffData["Last Name"]} (${staffData["Email"]})`}
                            </div>
                            {/* private */}
                            <div className="collapse-content flex flex-col">
                                <div className="flex">
                                    <div className="text-sm">
                                        Can access "Private"
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle"
                                        checked={staffData["Private"]}
                                        onChange={() =>
                                            setStaff({
                                                ...staff,
                                                [staffId]: {
                                                    ...staffData,
                                                    Private:
                                                        !staffData["Private"],
                                                },
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex">
                                    <div className="text-sm">
                                        Can invite other accounts
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle"
                                        checked={staffData["Invite"]}
                                        onChange={() =>
                                            setStaff({
                                                ...staff,
                                                [staffId]: {
                                                    ...staffData,
                                                    Invite: !staffData[
                                                        "Private"
                                                    ],
                                                },
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </fieldset>
        </form>
    );
}
