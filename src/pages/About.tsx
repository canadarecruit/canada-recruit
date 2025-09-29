import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Target, 
  Shield, 
  Award, 
  MapPin, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  Handshake
} from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Transparence",
      description: "Processus clair et transparent à chaque étape de votre parcours."
    },
    {
      icon: Heart,
      title: "Bienveillance",
      description: "Accompagnement humain et personnalisé pour chaque candidat."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Standards de qualité élevés et expertise reconnue."
    },
    {
      icon: Handshake,
      title: "Engagement",
      description: "Nous nous engageons pour votre réussite jusqu'au bout."
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Création de l'entreprise",
      description: "Lancement de Canada Recruit avec une vision claire : démocratiser l'accès à l'emploi au Canada."
    },
    {
      year: "2020",
      title: "Premiers partenariats",
      description: "Établissement de relations avec 25 entreprises canadiennes dans différents secteurs."
    },
    {
      year: "2021",
      title: "Expansion numérique",
      description: "Lancement de notre plateforme en ligne pour simplifier les démarches."
    },
    {
      year: "2022",
      title: "1000 candidats placés",
      description: "Franchissement du cap des 1000 professionnels accompagnés avec succès."
    },
    {
      year: "2023",
      title: "Certification officielle",
      description: "Obtention des certifications canadiennes pour l'accompagnement en immigration."
    },
    {
      year: "2024",
      title: "Expansion internationale",
      description: "Ouverture de bureaux dans 5 pays pour mieux servir nos candidats."
    }
  ];

  const team = [
    {
      name: "Sophie Martin",
      role: "Directrice Générale",
      experience: "15 ans d'expérience en immigration canadienne",
      description: "Experte en politiques d'immigration, Sophie guide notre vision stratégique."
    },
    {
      name: "David Thompson",
      role: "Directeur des Partenariats",
      experience: "12 ans dans le recrutement international",
      description: "Responsable du développement de notre réseau d'entreprises partenaires au Canada."
    },
    {
      name: "Aminata Diallo",
      role: "Responsable Accompagnement",
      experience: "8 ans en conseil en carrière",
      description: "Spécialiste de l'accompagnement personnalisé des candidats."
    },
    {
      name: "Michael Chen",
      role: "Directeur Technique",
      experience: "10 ans en développement logiciel",
      description: "Architecte de notre plateforme sécurisée et innovante."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-background via-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6">
                À propos de nous
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Votre partenaire de confiance pour{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  réussir au Canada
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Depuis 2019, nous accompagnons les professionnels internationaux dans leur projet 
                d'immigration vers le Canada avec expertise, transparence et bienveillance.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Target className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Notre Mission</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Faciliter l'accès à l'emploi au Canada pour les professionnels internationaux 
                    en offrant un accompagnement complet, sécurisé et personnalisé. Nous croyons 
                    que chaque talent mérite sa chance de s'épanouir professionnellement.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Globe className="h-6 w-6 text-secondary" />
                    <h2 className="text-2xl font-bold">Notre Vision</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Devenir la référence mondiale en matière de recrutement international vers le Canada, 
                    en connectant les talents du monde entier avec les opportunités canadiennes.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">2500+</div>
                    <div className="text-sm text-muted-foreground">Professionnels accompagnés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">150+</div>
                    <div className="text-sm text-muted-foreground">Entreprises partenaires</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 backdrop-blur-sm border border-border">
                  <div className="grid grid-cols-2 gap-6">
                    {values.map((value, index) => {
                      const IconComponent = value.icon;
                      return (
                        <div key={index} className="text-center space-y-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto">
                            <IconComponent className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{value.title}</h3>
                            <p className="text-xs text-muted-foreground">{value.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Notre{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  parcours
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                5 années d'évolution et d'innovation au service de votre réussite
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                        {milestone.year}
                      </div>
                    </div>
                    <Card className="flex-1">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Notre{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  équipe
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Des experts passionnés à votre service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-primary-foreground font-bold text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.experience}</p>
                    <p className="text-xs text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à commencer votre aventure canadienne ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez les milliers de professionnels qui nous ont fait confiance 
                pour réaliser leur rêve canadien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/register">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <Link to="/contact">
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;