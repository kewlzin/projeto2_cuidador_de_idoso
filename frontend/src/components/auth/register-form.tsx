import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { userService } from "@/services/api";

enum UserType {
  PATIENT = 'patient',
  CAREGIVER = 'caregiver',
  DOCTOR = 'doctor'
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<UserType>(UserType.PATIENT);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Campos específicos para paciente
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");

  // Campos específicos para cuidador
  const [bio, setBio] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [certifications, setCertifications] = useState("");

  // Campos específicos para médico
  const [crm, setCrm] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [institution, setInstitution] = useState("");
  const [documents, setDocuments] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      setIsLoading(true);
      const profileData = {
        full_name: name,
        email,
        password,
        role: userType,
        phone,
      };

      // Adiciona campos específicos baseado no tipo de usuário
      if (userType === UserType.PATIENT) {
        Object.assign(profileData, {
          age: parseInt(age),
          address,
        });
      } else if (userType === UserType.CAREGIVER) {
        Object.assign(profileData, {
          bio,
          experience_years: parseInt(experienceYears),
          certifications,
        });
      } else if (userType === UserType.DOCTOR) {
        Object.assign(profileData, {
          crm,
          specialty,
          institution,
          documents,
        });
      }

      await userService.register(profileData);
      
      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPatientFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="age">Idade</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </div>
    </>
  );

  const renderCaregiverFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="bio">Biografia</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Conte um pouco sobre sua experiência como cuidador..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="experienceYears">Anos de Experiência</Label>
        <Input
          id="experienceYears"
          type="number"
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="certifications">Certificações</Label>
        <Textarea
          id="certifications"
          value={certifications}
          onChange={(e) => setCertifications(e.target.value)}
          placeholder="Liste suas certificações..."
          required
        />
      </div>
    </>
  );

  const renderDoctorFields = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="crm">CRM</Label>
        <Input
          id="crm"
          value={crm}
          onChange={(e) => setCrm(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialty">Especialidade</Label>
        <Input
          id="specialty"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="institution">Instituição</Label>
        <Input
          id="institution"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="documents">Documentos</Label>
        <Input
          id="documents"
          type="file"
          onChange={(e) => setDocuments(e.target.files?.[0]?.name || '')}
          required
        />
      </div>
    </>
  );
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Cadastre-se na CuidarBem</CardTitle>
        <CardDescription>
          Crie sua conta para começar a utilizar nossa plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tipo de Usuário</Label>
            <RadioGroup value={userType} onValueChange={(value) => setUserType(value as UserType)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserType.PATIENT} id="patient" />
                <Label htmlFor="patient" className="cursor-pointer">Responsável por Idoso</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserType.CAREGIVER} id="caregiver" />
                <Label htmlFor="caregiver" className="cursor-pointer">Enfermeiro/Cuidador</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={UserType.DOCTOR} id="doctor" />
                <Label htmlFor="doctor" className="cursor-pointer">Médico</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Campos específicos baseados no tipo de usuário */}
          {userType === UserType.PATIENT && renderPatientFields()}
          {userType === UserType.CAREGIVER && renderCaregiverFields()}
          {userType === UserType.DOCTOR && renderDoctorFields()}
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-center text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-brand-blue hover:underline font-medium">
            Faça login
          </Link>
        </div>
        <div className="text-center text-xs text-gray-500">
          Ao se cadastrar, você concorda com nossos{" "}
          <Link to="/termos" className="text-brand-blue hover:underline">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link to="/privacidade" className="text-brand-blue hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
