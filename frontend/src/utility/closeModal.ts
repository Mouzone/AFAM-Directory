export default function closeModal() {
    const modal = document?.getElementById("Modal") as HTMLDialogElement | null;
    modal?.close();
}
