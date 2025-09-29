import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Star, Users, Globe } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-xl"></div>
      
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Shield className="mr-2 h-3 w-3" />
                Recrutement sécurisé et certifié
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Votre{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  avenir professionnel
                </span>{" "}
                au Canada commence ici
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Accompagnement complet et personnalisé pour votre recrutement international. 
                De l'inscription au départ, nous sécurisons chaque étape de votre projet.
              </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">2500+</div>
                <div className="text-sm text-muted-foreground">Candidats placés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-secondary">150+</div>
                <div className="text-sm text-muted-foreground">Entreprises partenaires</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent">95%</div>
                <div className="text-sm text-muted-foreground">Taux de réussite</div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-lg px-8"
                asChild
              >
                <Link to="/register">
                  Commencer l'inscription
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <Link to="/procedure">
                  Voir la procédure
                </Link>
              </Button>
            </div>

            {/* Témoignage rapide */}
            <div className="flex items-center space-x-4 p-4 bg-card rounded-lg border border-border shadow-soft">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  "Processus transparent et accompagnement exceptionnel. Je recommande vivement!"
                </p>
                <p className="text-xs font-medium text-foreground mt-1">
                  - Marie L., Ingénieure à Toronto
                </p>
              </div>
            </div>
          </div>

          {/* Image/Illustration */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 backdrop-blur-sm border border-border shadow-canada">
              <div className="aspect-square bg-gradient-to-br from-primary to-secondary rounded-xl shadow-strong flex items-center justify-center">
                <div className="text-center text-primary-foreground">
                  <Globe className="h-24 w-24 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Canada</h3>
                  <p className="text-primary-foreground/80">Votre destination</p>
                </div>
              </div>
              
              {/* Éléments flottants */}
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium shadow-medium">
                ✓ Certifié
              </div>
              <div className="absolute -bottom-4 -left-4 bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-medium shadow-medium">
                🇨🇦 Officiel
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;