import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Marie Dupont",
      role: "Infirmière",
      location: "Montréal, QC",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "L'équipe de Canada Recruit m'a accompagnée tout au long du processus. Grâce à leur professionnalisme, j'ai obtenu mon visa et trouvé un emploi dans un excellent hôpital de Montréal. Je recommande vivement leurs services !",
      date: "Arrivée en mars 2024"
    },
    {
      id: 2,
      name: "Jean-Claude Mbeki",
      role: "Développeur",
      location: "Toronto, ON",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Processus transparent et équipe très professionnelle. Le suivi était constant et les conseils précieux. Aujourd'hui, je travaille dans une startup tech à Toronto et je ne pourrais pas être plus heureux !",
      date: "Arrivée en janvier 2024"
    },
    {
      id: 3,
      name: "Sarah Ben Ali",
      role: "Ingénieure",
      location: "Calgary, AB",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Canada Recruit a dépassé mes attentes. Non seulement ils ont sécurisé mon visa, mais ils m'ont aussi aidée à préparer mes entretiens. Le résultat : un poste d'ingénieure dans une grande compagnie pétrolière !",
      date: "Arrivée en février 2024"
    },
    {
      id: 4,
      name: "Pierre Kamga",
      role: "Chef Cuisinier",
      location: "Vancouver, BC",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Service exceptionnel ! L'équipe comprend vraiment les défis de l'immigration. Ils m'ont guidé pas à pas et maintenant je dirige la cuisine d'un restaurant réputé de Vancouver. Merci infiniment !",
      date: "Arrivée en décembre 2023"
    },
    {
      id: 5,
      name: "Fatima El Mansouri",
      role: "Comptable",
      location: "Ottawa, ON",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "La plateforme en ligne est très intuitive et le suivi en temps réel m'a permis de rester sereine durant tout le processus. Aujourd'hui, je travaille au gouvernement fédéral. Un rêve devenu réalité !",
      date: "Arrivée en avril 2024"
    },
    {
      id: 6,
      name: "Ahmed Benali",
      role: "Mécanicien",
      location: "Edmonton, AB",
      image: "/placeholder-avatar.jpg",
      rating: 5,
      text: "Après plusieurs échecs avec d'autres agences, Canada Recruit a réussi là où les autres ont échoué. Leur expertise et leur sérieux font toute la différence. Je travaille maintenant dans l'industrie pétrolière !",
      date: "Arrivée en mai 2024"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Témoignages clients
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ce que disent nos{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              candidats placés
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les témoignages de professionnels qui ont réussi leur transition
            vers le Canada grâce à notre accompagnement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20 bg-card"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Citation */}
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                    <p className="text-muted-foreground leading-relaxed italic pl-6">
                      "{testimonial.text}"
                    </p>
                  </div>

                  {/* Note */}
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Profil */}
                  <div className="flex items-center space-x-3 pt-4 border-t border-border">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium text-lg">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          📍 {testimonial.location}
                        </p>
                        <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                          {testimonial.date}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Section statistiques de satisfaction */}
        <div className="mt-16 bg-card rounded-2xl border border-border p-8 shadow-soft">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Taux de satisfaction</div>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-secondary">4.9/5</div>
              <div className="text-sm text-muted-foreground">Note moyenne</div>
              <div className="text-xs text-muted-foreground">Basé sur 2,500+ avis</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-success">95%</div>
              <div className="text-sm text-muted-foreground">Recommandent nos services</div>
              <div className="text-xs text-muted-foreground">À leurs proches</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;