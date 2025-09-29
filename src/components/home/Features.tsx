import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Clock, 
  Users, 
  FileCheck, 
  CreditCard, 
  MessageSquare,
  MapPin,
  Award,
  Headphones
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Processus sécurisé",
      description: "Protection complète de vos données personnelles et documents confidentiels.",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Clock,
      title: "Suivi en temps réel",
      description: "Suivez l'avancement de votre dossier 24h/24 avec notre tableau de bord.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Users,
      title: "Équipe experte",
      description: "Conseillers spécialisés en immigration canadienne à votre écoute.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: FileCheck,
      title: "Documents validés",
      description: "Vérification et validation de tous vos documents par nos experts.",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: CreditCard,
      title: "Paiement flexible",
      description: "Options de paiement multiples : Mobile Money, cartes, virements.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: MessageSquare,
      title: "Support continu",
      description: "Assistance et conseils personnalisés tout au long du processus.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: MapPin,
      title: "Partenaires locaux",
      description: "Réseau d'entreprises partenaires directement au Canada.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Award,
      title: "Taux de réussite élevé",
      description: "95% de nos candidats obtiennent leur visa et trouvent un emploi.",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Headphones,
      title: "Assistance 24/7",
      description: "Support client disponible en permanence pour répondre à vos questions.",
      color: "text-warning",
      bgColor: "bg-warning/10"
    }
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Pourquoi nous choisir ?
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Un accompagnement{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              complet et professionnel
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nous mettons tout en œuvre pour sécuriser votre parcours vers le Canada
            avec nos services experts et notre technologie de pointe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Section statistiques supplémentaires */}
        <div className="mt-20 bg-card rounded-2xl border border-border p-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5 ans</div>
              <div className="text-sm text-muted-foreground">d'expérience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">48h</div>
              <div className="text-sm text-muted-foreground">délai de traitement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warning mb-2">100%</div>
              <div className="text-sm text-muted-foreground">légal et conforme</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">support client</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;