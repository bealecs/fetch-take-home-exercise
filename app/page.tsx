import { AuthorizeUserForm } from "./components/AuthorizeUserForm";

export default function Home() {
  return (
    <div className="min-h-screen content-center bg-blue-800 text-blue-400">
      <h1 className="text-6xl">Hello World</h1>
      <AuthorizeUserForm />
    </div>
  );
}
