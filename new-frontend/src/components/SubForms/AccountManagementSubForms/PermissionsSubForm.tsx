export default function PermissionsSubForm({ staff, setStaff }) {
    return (
        <>
            <fieldset className="fieldset w-s bg-base-200 border border-base-300 p-4 rounded-box">
                <legend className="fieldset-legend">Permissions</legend>
                <label className="fieldset-label">Sermon Attendance</label>
                {/* accordian upon accordians: First, Last (email) > Private, Invite > fine tuned permissions for each */}
            </fieldset>
        </>
    );
}
