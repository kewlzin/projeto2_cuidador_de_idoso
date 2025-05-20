import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { RegisterForm } from "@/components/auth/register-form";

const Register = () => {
  return (
    <div className="h-screen flex flex-col relative">
      <Header />
      <main className="flex-1 overflow-y-auto pt-[72px] mb-[10rem] relative z-0">
        <div className="container mx-auto px-4">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
