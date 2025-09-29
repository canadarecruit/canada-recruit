import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, DollarSign, ArrowRight, Star } from "lucide-react";

// Import de la variable API_BASE_URL depuis le fichier de configuration
import API_BASE_URL from "../../config";

// Utility function to format time difference
const formatTimeDifference = (postedDate) => {
  if (!postedDate) return 'N/A';

  const now = new Date();
  const posted = new Date(postedDate);
  const diffMs = now - posted; // Difference in milliseconds

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSeconds < 60) {
    return `Il y a ${diffSeconds} seconde${diffSeconds !== 1 ? 's' : ''}`;
  } else if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours !== 1 ? 's' : ''}`;
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jour${diffDays !== 1 ? 's' : ''}`;
  } else {
    return `Il y a ${diffWeeks} semaine${diffWeeks !== 1 ? 's' : ''}`;
  }
};

// Utility function to check if job is available (less than 1 week)
const isJobAvailable = (postedDate) => {
  if (!postedDate) return false;
  const now = new Date();
  const posted = new Date(postedDate);
  const diffMs = now - posted;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays < 7; // Less than 7 days
};

const JobOffers = () => {
  // State to store the job offers fetched from the API
  const [jobOffers, setJobOffers] = useState([]);
  // State to handle the loading status
  const [loading, setLoading] = useState(true);
  // State to handle any potential errors during the fetch
  const [error, setError] = useState(null);

  useEffect(() => {
    // Asynchronous function to fetch job offers from the API
    const fetchJobOffers = async () => {
      try {
        // Start by setting loading to true and clearing any previous errors
        setLoading(true);
        setError(null);

        // Construction de l'URL complète en utilisant API_BASE_URL
        const apiUrl = `${API_BASE_URL}/api/job_offers`;

        // Fetch data with Authorization header (assuming JWT is stored in localStorage)
        const token = localStorage.getItem('token'); // Adjust based on how you store the token
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Check if the response was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON data from the response
        const data = await response.json();

        // Check if data contains the job_offers array
        if (!data.job_offers || !Array.isArray(data.job_offers)) {
          throw new Error('Invalid response format: job_offers array not found');
        }

        // Get the first 4 job offers
        const firstFourJobs = data.job_offers.slice(0, 4);

        // Update the state with the fetched and sliced data
        setJobOffers(firstFourJobs);

      } catch (e) {
        // If an error occurs, update the error state
        console.error("Failed to fetch job offers:", e);
        setError("Impossible de charger les offres d'emploi. Veuillez réessayer plus tard.");
      } finally {
        // Regardless of success or failure, set loading to false
        setLoading(false);
      }
    };

    // Call the fetch function when the component mounts
    fetchJobOffers();
  }, []); // The empty dependency array ensures this effect runs only once

  const getCategoryColor = (category) => {
    const colors = {
      "Technologie": "bg-primary/10 text-primary",
      "Santé": "bg-green-500/10 text-green-500",
      "Ingénierie": "bg-secondary/10 text-secondary",
      "Restauration": "bg-yellow-500/10 text-yellow-500"
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  // Conditionally render based on loading and error states
  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-500">Chargement des offres...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Opportunités d'emploi
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Offres d'emploi{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              disponibles au Canada
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez les opportunités professionnelles qui vous attendent dans différents secteurs
            à travers le Canada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {jobOffers.map((job) => (
            <Card
              key={job.id}
              className={`group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 ${
                job.featured ? 'ring-2 ring-primary/20 bg-primary/5' : 'border-border'
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {/* Correction : Utilisation d'un opérateur ternaire pour éviter l'affichage de '0' */}
                      {job.featured ? (
                        <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          Vedette
                        </Badge>
                      ) : null}
                      <Badge variant="outline" className={getCategoryColor(job.category)}>
                        {job.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {job.title}
                    </CardTitle>
                    <p className="text-muted-foreground font-medium">{job.company}</p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    {/* Utilisation de la nouvelle fonction pour formater le temps */}
                    {formatTimeDifference(job.posted)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {job.description || 'Aucune description disponible'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {job.location || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm">
                    <Briefcase className="w-4 h-4 mr-2 text-secondary" />
                    {job.type || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                    {job.salary || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                    {/* Utilisation de la nouvelle fonction pour formater le temps */}
                    {formatTimeDifference(job.posted)}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Compétences requises :</p>
                  <div className="flex flex-wrap gap-2">
                    {/* Correction : Diviser la chaîne de caractères par les virgules et créer une badge pour chaque élément. */}
                    {job.requirements && job.requirements.split(',').map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {req.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  {isJobAvailable(job.posted) ? (
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      asChild
                    >
                      <Link to={`/dashboard`}>
                        Offre disponible
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      disabled
                    >
                      Offre indisponible
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/jobs">
              Voir toutes les offres
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobOffers;