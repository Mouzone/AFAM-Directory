export default function Tab({ currTab, value, setTab, children }) {
    return (
        <>
            <input
                type="radio"
                name="general"
                className="tab"
                aria-label={value.charAt(0).toUpperCase() + value.slice(1)}
                checked={currTab === value}
                onChange={() => setTab(value)}
            />
            <div className="tab-content bg-base-100 border-base-300 p-2">
                {children}
            </div>
        </>
    );
}
