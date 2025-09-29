import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Processus de recrutement",
      questions: [
        {
          question: "Combien de temps dure le processus complet ?",
          answer: "Le processus complet peut prendre entre 3 à 6 mois selon votre profil et le type d'emploi. Cela inclut le traitement du dossier (2-4 semaines), l'obtention d'une offre d'emploi, les démarches de visa (4-8 semaines) et la préparation au départ."
        },
        {
          question: "Quels sont les frais de service ?",
          answer: "Nos frais de service varient selon le type d'accompagnement choisi. Ils couvrent l'évaluation du dossier, la mise en relation avec les employeurs, l'assistance visa et le suivi personnalisé. Contactez-nous pour un devis personnalisé."
        },
        {
          question: "Quelle est votre garantie de succès ?",
          answer: "Nous offrons un taux de réussite de plus de 85% pour les candidats éligibles. Si votre dossier est refusé pour des raisons indépendantes de votre volonté après validation de l'éligibilité, nous vous remboursons 70% des frais payés."
        }
      ]
    },
    {
      title: "Éligibilité et documents",
      questions: [
        {
          question: "Quels documents dois-je fournir ?",
          answer: "Vous devez fournir : CV détaillé, copies des diplômes et certificats, passeport valide, photos d'identité, relevés de notes, lettres de recommandation, certificat médical et casier judiciaire vierge."
        },
        {
          question: "Dois-je parler anglais ou français ?",
          answer: "Cela dépend de la province et du poste. Le Québec privilégie le français, tandis que les autres provinces requièrent généralement l'anglais. Certains postes acceptent un niveau de base, d'autres exigent une maîtrise avancée."
        },
        {
          question: "Quel âge maximum pour postuler ?",
          answer: "Il n'y a pas d'âge maximum légal, mais la plupart des programmes favorisent les candidats de moins de 45 ans. Cependant, l'expérience et les compétences spécialisées peuvent compenser l'âge."
        }
      ]
    },
    {
      title: "Paiement et remboursement",
      questions: [
        {
          question: "Quels modes de paiement acceptez-vous ?",
          answer: "Nous acceptons les paiements par Mobile Money (Orange Money, MTN Money, Moov Money), cartes bancaires, PayPal, et virements bancaires. Tous les paiements sont sécurisés et cryptés."
        },
        {
          question: "Puis-je payer en plusieurs fois ?",
          answer: "Oui, nous proposons des plans de paiement échelonnés selon les étapes du processus. Un premier paiement pour l'évaluation du dossier, puis des paiements selon l'avancement de votre dossier."
        },
        {
          question: "Dans quels cas puis-je être remboursé ?",
          answer: "Remboursement possible si : votre dossier est jugé non éligible après évaluation initiale (100%), refus de visa pour raisons techniques (70%), ou annulation de votre part dans les 48h (90%)."
        }
      ]
    },
    {
      title: "Vie au Canada",
      questions: [
        {
          question: "Comment se passe l'installation au Canada ?",
          answer: "Nous vous assistons pour : recherche de logement temporaire, ouverture de compte bancaire, démarches d'assurance santé, inscription des enfants à l'école, et orientation dans votre nouvelle ville."
        },
        {
          question: "Quel est le coût de la vie au Canada ?",
          answer: "Le coût varie selon les villes. Toronto et Vancouver sont plus chères (2500-3500 CAD/mois pour une famille), tandis que Winnipeg ou Québec sont plus abordables (1800-2500 CAD/mois). Nous vous fournissons un guide détaillé."
        },
        {
          question: "Puis-je faire venir ma famille ?",
          answer: "Oui, une fois votre permis de travail obtenu, vous pouvez faire une demande de regroupement familial pour votre conjoint(e) et enfants à charge. Le processus prend généralement 6-12 mois."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Questions Fréquentes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Trouvez rapidement les réponses à vos questions sur le processus de recrutement, 
            les frais, les délais et la vie au Canada.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Support 24/7
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Réponses Détaillées
            </Badge>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="text-2xl text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support Section */}
        <div className="mt-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">
                Vous ne trouvez pas votre réponse ?
              </CardTitle>
              <CardDescription className="text-lg">
                Notre équipe d'experts est disponible pour répondre à toutes vos questions spécifiques.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center p-4">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Chat en ligne</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Réponse immédiate à vos questions
                  </p>
                  <Button variant="outline" size="sm">
                    Démarrer le chat
                  </Button>
                </Card>

                <Card className="text-center p-4">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Appelez-nous</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Du lundi au vendredi, 9h-18h
                  </p>
                  <Button variant="outline" size="sm">
                    +1 (555) 123-4567
                  </Button>
                </Card>

                <Card className="text-center p-4">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Réponse sous 24h ouvrées
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/contact">Nous contacter</Link>
                  </Button>
                </Card>
              </div>

              <div className="text-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark" asChild>
                  <Link to="/contact">Prendre rendez-vous avec un conseiller</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <div className="mt-12">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">💡 Conseils utiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Préparation du dossier</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Préparez tous vos documents en amont</li>
                    <li>• Faites traduire vos diplômes si nécessaire</li>
                    <li>• Assurez-vous que votre passeport est valide 2 ans</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-primary">Processus de candidature</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Remplissez votre profil avec précision</li>
                    <li>• Répondez rapidement aux demandes de documents</li>
                    <li>• Consultez régulièrement votre tableau de bord</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;