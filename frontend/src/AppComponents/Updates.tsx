interface UpdatesProps {
    updates: {
        added: string[],
        modified: string[], 
        removed: string[]
    }
}

export default function Updates({updates}: UpdatesProps) {
    return (
        <div className="fixed w-l bottom-4 left-1/2 -translate-x-1/2 bg-gray-100 border border-gray-200 rounded-md p-4 shadow-sm z-50">
            {updates["added"].length !== 0 && (
                <p className="text-green-600 font-medium truncate">
                    Added: {updates["added"].join(", ")}
                </p>
            )}
            {updates["modified"].length !== 0 && (
                <p className="text-blue-600 font-medium truncate">
                    Edited: {updates["modified"].join(" ")}
                </p>
            )}
            {updates["removed"].length !== 0 && (
                <p className="text-red-600 font-medium truncate">
                    Deleted: {updates["removed"].join(" ")}
                </p>
            )}
        </div>
    );
}
