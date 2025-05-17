
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { RegisterForm } from "@/components/auth/register-form";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-16 bg-brand-gray">
        <div className="container mx-auto px-4">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
