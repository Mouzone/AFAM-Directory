export default function PrivateSubForm() {
    return (
        <>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box flex">
                <legend className="fieldset-legend">Address</legend>

                <div className="flex flex-col">
                    <label className="fieldset-label">Street Address</label>
                    <input type="text" className="input" />
                </div>

                <div className="flex flex-col">
                    <label className="fieldset-label">City</label>
                    <input type="text" className="input" />
                </div>

                <div className="flex flex-col">
                    <label className="fieldset-label">Zip Code</label>
                    <input type="text" className="input" />
                </div>
            </fieldset>

            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box flex">
                <legend className="fieldset-legend">
                    Personal Contact Info{" "}
                </legend>

                <div className="flex flex-col">
                    <label className="fieldset-label">Phone</label>
                    <input type="text" className="input" />
                </div>

                <div className="flex flex-col">
                    <label className="fieldset-label">Email</label>
                    <input type="text" className="input" />
                </div>
            </fieldset>

            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">
                    Parent 1 Contact Info
                </legend>

                <div className="flex">
                    <div className="flex flex-col">
                        <label className="fieldset-label">First Name</label>
                        <input type="text" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Last Name</label>
                        <input type="text" className="input" />
                    </div>
                </div>
                <div className="flex">
                    <div className="flex flex-col">
                        <label className="fieldset-label">Phone</label>
                        <input type="text" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Email</label>
                        <input type="text" className="input" />
                    </div>
                </div>
            </fieldset>

            <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">
                    Parent 2 Contact Info
                </legend>

                <div className="flex">
                    <div className="flex flex-col">
                        <label className="fieldset-label">First Name</label>
                        <input type="text" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Last Name</label>
                        <input type="text" className="input" />
                    </div>
                </div>
                <div className="flex">
                    <div className="flex flex-col">
                        <label className="fieldset-label">Phone</label>
                        <input type="text" className="input" />
                    </div>
                    <div className="flex flex-col">
                        <label className="fieldset-label">Email</label>
                        <input type="text" className="input" />
                    </div>
                </div>
            </fieldset>
        </>
    );
}
