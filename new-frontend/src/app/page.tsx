import LoginForm from "@/components/Forms/LoginForm";
import SignUpForm from "@/components/Forms/SignUpForm";

export default function Page() {
    return (
        <div className="w-screen h-screen flex flex-col lg:flex-row justify-center items-center">
            <LoginForm />
            <div className="divider lg:divider-horizontal">OR</div>
            <SignUpForm />
        </div>
    );
}
