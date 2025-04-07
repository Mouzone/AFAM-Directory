import GeneralSubForm from "../SubForms/GeneralSubForm";

export default function CreateStudentForm() {
    // state has both public and contact fields
    // state has tab to be selected
    // onSubmit write to fireStore
    return (
        <form>
            {/* headshot */}
            <div className="flex flex-col">
                {/* tabs */}
                <GeneralSubForm />
            </div>
            {/* submit + cancel */}
        </form>
    );
}
