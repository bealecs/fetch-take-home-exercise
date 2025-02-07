import { AuthorizeUserForm } from "./components/AuthorizeUserForm";

export default function Home() {
  return (
    <div className="min-h-screen content-center items-center bg-blue-800 text-blue-400">
      <h1 className="text-6xl text-center my-12">Fetch take home exercise</h1>
      <AuthorizeUserForm />
    </div>
  );
}
