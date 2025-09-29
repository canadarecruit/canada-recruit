import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Lock, Mail, Eye, EyeOff, Globe } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import API_BASE_URL from "../config";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState<string | null>(null); // Added error state
  const [success, setSuccess] = useState<string | null>(null); // Added success state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validate required fields
    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Veuillez entrer un email valide.");
      setLoading(false);
      return;
    }

    // Prepare payload for API
    const payload = {
      email: formData.email,
      password: formData.password
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      setSuccess(data.message || "Connexion réussie ! Redirection en cours...");
      
      // Store JWT token (assuming backend returns a token)
      if (data.token) {
        if (formData.rememberMe) {
          localStorage.setItem('token', data.token); // Persistent storage
        } else {
          sessionStorage.setItem('token', data.token); // Session storage
        }
      }

      // Reset form
      setFormData({
        email: "",
        password: "",
        rememberMe: false
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => window.location.href = '/dashboard', 2000);
    } catch (e: any) {
      console.error("Échec de la connexion :", e);
      setError(e.message || "Impossible de se connecter. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="w-full max-w-md">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Globe className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Canada Recruit
            </h1>
            <p className="text-muted-foreground mt-2">
              Connectez-vous à votre espace candidat
            </p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Connexion</CardTitle>
              <CardDescription>
                Accédez à votre tableau de bord pour suivre votre candidature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
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

                  <div>
                    <label className="text-sm font-medium mb-2 block">Mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        className="pl-10 pr-10"
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
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, rememberMe: checked as boolean})
                      }
                      disabled={loading}
                    />
                    <label htmlFor="remember" className="text-sm">
                      Se souvenir de moi
                    </label>
                  </div>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>

                {(error || success) && (
                  <div className="mt-4">
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

              <div className="mt-6">
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore de compte ?{" "}
                    <Link 
                      to="/register" 
                      className="text-primary hover:underline font-medium"
                    >
                      Créer un compte
                    </Link>
                  </p>
                </div>
              </div>

              {/* Quick Access */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium text-sm mb-3">Accès rapide :</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>• Suivi de candidature</span>
                    <span>📊</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Gestion des documents</span>
                    <span>📁</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• Historique des paiements</span>
                    <span>💳</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Notre équipe support est disponible pour vous aider.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/contact">Nous contacter</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/faq">FAQ</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;