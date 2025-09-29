import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Globe, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    nationality: "",
    currentCountry: "",
    currentCity: "",
    preferredProvince: "",
    currentJob: "",
    experience: "",
    education: "",
    languages: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    newsletter: false
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.nationality) {
        setError("Veuillez remplir tous les champs obligatoires de cette étape.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.currentCountry || !formData.currentCity) {
        setError("Veuillez remplir tous les champs obligatoires de cette étape.");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.currentJob || !formData.experience || !formData.education || !formData.languages) {
        setError("Veuillez remplir tous les champs obligatoires de cette étape.");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.acceptTerms) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Veuillez entrer un email valide.");
      setLoading(false);
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      acceptTerms: formData.acceptTerms,
      phone: formData.phone || undefined,
      birthDate: formData.birthDate || undefined,
      nationality: formData.nationality || undefined,
      currentCountry: formData.currentCountry || undefined,
      currentCity: formData.currentCity || undefined,
      preferredProvince: formData.preferredProvince || undefined,
      currentJob: formData.currentJob || undefined,
      experience: formData.experience || undefined,
      education: formData.education || undefined,
      languages: formData.languages || undefined,
      newsletter: formData.newsletter
    };

    try {
      // Register user
      const userResponse = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      const userId = userData.user_id;

      // Define steps with current date for completed steps and next day for current step
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const steps = [
        { id: 1, name: "Profil créé", status: "completed", date: today },
        { id: 2, name: "Formulaire complété", status: "completed", date: today },
        { id: 3, name: "Documents déposés", status: "current", date: today },
        { id: 4, name: "Paiement effectué", status: "pending", date: "" },
        { id: 5, name: "Traitement du dossier", status: "pending", date: "" },
        { id: 6, name: "Visa & biométrie", status: "pending", date: "" },
        { id: 7, name: "Préparation au départ", status: "pending", date: "" }
      ];

      // Create user steps
      const stepsResponse = await fetch(`${API_BASE_URL}/api/user_steps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId, steps }),
      });

      if (!stepsResponse.ok) {
        const errorData = await stepsResponse.json();
        throw new Error(errorData.message || `Erreur lors de la création des étapes ! Statut : ${stepsResponse.status}`);
      }

      setSuccess(userData.message || "Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: "",
        nationality: "",
        currentCountry: "",
        currentCity: "",
        preferredProvince: "",
        currentJob: "",
        experience: "",
        education: "",
        languages: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        newsletter: false
      });
      setCurrentStep(1);
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (e: any) {
      console.error("Échec de l'inscription :", e);
      setError(e.message || "Impossible de créer le compte. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    "Informations personnelles",
    "Localisation",
    "Profil professionnel",
    "Création du compte"
  ];

  const countries = ["France", "Sénégal", "Côte d'Ivoire", "Cameroun", "Mali", "Burkina Faso", "Maroc", "Tunisie"];
  const provinces = ["Ontario", "Québec", "Colombie-Britannique", "Alberta", "Manitoba", "Saskatchewan"];
  const educationLevels = ["Baccalauréat", "Licence/Bachelor", "Master", "Doctorat", "Formation professionnelle"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Créer votre profil candidat
            </h1>
            <p className="text-muted-foreground">
              Complétez votre inscription pour accéder aux opportunités d'emploi au Canada
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Étape {currentStep} sur {totalSteps}</span>
                <Badge variant="secondary">{Math.round(progress)}% complété</Badge>
              </div>
              <Progress value={progress} className="mb-4" />
              <h2 className="text-lg font-semibold text-center">{stepTitles[currentStep - 1]}</h2>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Informations personnelles</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Prénom *</label>
                        <Input
                          placeholder="Votre prénom"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nom *</label>
                        <Input
                          placeholder="Votre nom"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Téléphone *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="+XX XXX XXX XXX"
                            className="pl-10"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date de naissance *</label>
                        <Input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Nationalité *</label>
                      <Select 
                        value={formData.nationality} 
                        onValueChange={(value) => setFormData({...formData, nationality: value})}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre nationalité" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Localisation</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Pays actuel *</label>
                        <Select 
                          value={formData.currentCountry} 
                          onValueChange={(value) => setFormData({...formData, currentCountry: value})}
                          disabled={loading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Votre pays actuel" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ville actuelle *</label>
                        <Input
                          placeholder="Votre ville"
                          value={formData.currentCity}
                          onChange={(e) => setFormData({...formData, currentCity: e.target.value})}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Province préférée au Canada</label>
                      <Select 
                        value={formData.preferredProvince} 
                        onValueChange={(value) => setFormData({...formData, preferredProvince: value})}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez une province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">💡 Conseil</h4>
                      <p className="text-sm text-muted-foreground">
                        Le choix de la province peut influencer vos opportunités d'emploi.
                        Le Québec privilégie le français, tandis que les autres provinces requièrent l'anglais.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Profil professionnel</h3>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Profession actuelle *</label>
                      <Input
                        placeholder="Ex: Développeur web, Infirmier, Mécanicien..."
                        value={formData.currentJob}
                        onChange={(e) => setFormData({...formData, currentJob: e.target.value})}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Années d'expérience *</label>
                      <Select 
                        value={formData.experience} 
                        onValueChange={(value) => setFormData({...formData, experience: value})}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre expérience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 an</SelectItem>
                          <SelectItem value="2-5">2-5 ans</SelectItem>
                          <SelectItem value="6-10">6-10 ans</SelectItem>
                          <SelectItem value="11+">Plus de 10 ans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Niveau d'éducation *</label>
                      <Select 
                        value={formData.education} 
                        onValueChange={(value) => setFormData({...formData, education: value})}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Votre niveau d'études" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Langues parlées *</label>
                      <Input
                        placeholder="Ex: Français (natif), Anglais (intermédiaire)"
                        value={formData.languages}
                        onChange={(e) => setFormData({...formData, languages: e.target.value})}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Création du compte</h3>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Mot de passe *</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 8 caractères"
                          className="pr-10"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Confirmer le mot de passe *</label>
                      <Input
                        type="password"
                        placeholder="Répétez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={formData.acceptTerms}
                          onCheckedChange={(checked) => setFormData({...formData, acceptTerms: checked as boolean})}
                          required
                          disabled={loading}
                        />
                        <label htmlFor="terms" className="text-sm leading-relaxed">
                          J'accepte les{" "}
                          <Link to="/terms" className="text-primary hover:underline">
                            conditions d'utilisation
                          </Link>{" "}
                          et la{" "}
                          <Link to="/privacy" className="text-primary hover:underline">
                            politique de confidentialité
                          </Link>
                        </label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="newsletter"
                          checked={formData.newsletter}
                          onCheckedChange={(checked) => setFormData({...formData, newsletter: checked as boolean})}
                          disabled={loading}
                        />
                        <label htmlFor="newsletter" className="text-sm">
                          Je souhaite recevoir les actualités et offres d'emploi par email
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 1 || loading}
                  >
                    Précédent
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-primary to-secondary"
                      disabled={loading}
                    >
                      Suivant
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-primary to-secondary"
                      disabled={!formData.acceptTerms || loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création en cours...
                        </>
                      ) : (
                        "Créer mon compte"
                      )}
                    </Button>
                  )}
                </div>

                {(error || success) && (
                  <div className="mt-6">
                    {error && (
                      <Card className="bg-red-50 border-red-200">
                        <CardContent className="pt-4">
                          <p className="text-red-600 text-sm">{error}</p>
                        </CardContent>
                      </Card>
                    )}
                    {success && (
                      <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-4">
                          <p className="text-green-600 text-sm">{success}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;