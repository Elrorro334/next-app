import LoginPanel from "../components/LoginPanel";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F3F7F9] px-6 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center">
        <LoginPanel />
      </div>
    </div>
  );
}
