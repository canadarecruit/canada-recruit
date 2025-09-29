import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, FileText, CreditCard, Upload, Clock, Plane, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Procedure = () => {
  const steps = [
    {
      number: 1,
      title: "Création de profil",
      description: "Inscrivez-vous et créez votre profil candidat avec vos informations personnelles.",
      icon: User,
      duration: "5 minutes",
      color: "bg-blue-500"
    },
    {
      number: 2,
      title: "Remplissage du formulaire",
      description: "Complétez le formulaire détaillé avec vos qualifications et expériences professionnelles.",
      icon: FileText,
      duration: "30 minutes",
      color: "bg-green-500"
    },
    {
      number: 3,
      title: "Dépôt des documents",
      description: "Téléchargez tous vos documents requis (CV, diplômes, passeport, etc.) de manière sécurisée.",
      icon: Upload,
      duration: "20 minutes",
      color: "bg-orange-500"
    },
    {
      number: 4,
      title: "Paiement des frais",
      description: "Effectuez le paiement sécurisé des frais de traitement via nos différentes options.",
      icon: CreditCard,
      duration: "2 minutes",
      color: "bg-purple-500"
    },
    {
      number: 5,
      title: "Traitement du dossier",
      description: "Notre équipe examine votre dossier et vous met en relation avec des employeurs canadiens.",
      icon: Clock,
      duration: "2-4 semaines",
      color: "bg-yellow-500"
    },
    {
      number: 6,
      title: "Visa & biométrie",
      description: "Assistance pour les démarches de visa et rendez-vous biométrie une fois l'offre d'emploi obtenue.",
      icon: MapPin,
      duration: "4-8 semaines",
      color: "bg-indigo-500"
    },
    {
      number: 7,
      title: "Préparation au départ",
      description: "Accompagnement final pour votre installation au Canada et intégration professionnelle.",
      icon: Plane,
      duration: "1-2 semaines",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Procédure de Recrutement
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Un processus simple et transparent en 7 étapes pour votre recrutement vers le Canada. 
            Nous vous accompagnons à chaque étape de votre parcours professionnel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Processus 100% Digital
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Suivi en Temps Réel
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Support Personnalisé
            </Badge>
          </div>
        </div>

        {/* Steps Section */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={step.number} className="relative overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className={`${step.color} text-white p-3 rounded-full`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-sm">
                        Étape {step.number}
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        {step.duration}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg leading-relaxed">
                  {step.description}
                </CardDescription>
                
                {/* Progress indicator */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 bottom-0 w-0.5 h-8 bg-border translate-y-full"></div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">
                Prêt à commencer votre aventure canadienne ?
              </CardTitle>
              <CardDescription className="text-lg">
                Rejoignez des milliers de candidats qui ont déjà fait confiance à notre expertise 
                pour leur recrutement au Canada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark" asChild>
                  <Link to="/register">Commencer l'inscription</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/jobs">Voir les offres d'emploi</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                ✓ Inscription gratuite • ✓ Paiement sécurisé • ✓ Support 24/7
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Procedure;