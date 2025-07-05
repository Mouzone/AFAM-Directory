// capitalize first letters of every word
export default function formatText(text: string) {
    if (text === "") {
        return text;
    }
    const words = text.split(" ");
    const words_capitalized = words.map(
        (word) => word ? word.at(0)?.toUpperCase() + word.slice(1) : word
    );
    return words_capitalized.join(" ");
}
