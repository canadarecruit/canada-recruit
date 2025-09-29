import React, { useState, useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Clock, DollarSign, Users, Search, Filter, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";

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

const Jobs = () => {
  const [jobOffers, setJobOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Hardcoded sectors and cities (aligned with API categories)
  const sectors = ["Tous", "Technologie", "Santé", "Ingénierie", "Restauration"];
  const cities = ["Toutes", "Toronto", "Vancouver", "Montréal", "Calgary"];

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = `${API_BASE_URL}/api/job_offers`;
        const token = localStorage.getItem('token');
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.job_offers || !Array.isArray(data.job_offers)) {
          throw new Error('Invalid response format: job_offers array not found');
        }

        // Normalize data: rename 'category' to 'sector' and split 'requirements' string
        const normalizedJobs = data.job_offers.map(job => ({
          ...job,
          sector: job.category,
          requirements: job.requirements ? job.requirements.split(',').map(req => req.trim()) : [],
        }));

        setJobOffers(normalizedJobs);
      } catch (e) {
        console.error("Failed to fetch job offers:", e);
        setError("Impossible de charger les offres d'emploi. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobOffers();
  }, []);

  const filteredJobs = jobOffers.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === "" || selectedSector === "Tous" || job.sector === selectedSector;
    const matchesCity = selectedCity === "" || selectedCity === "Toutes" || job.location.includes(selectedCity);
    return matchesSearch && matchesSector && matchesCity;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-20 text-xl text-gray-500">Chargement des offres...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center py-20 text-xl text-red-500">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Offres d'Emploi Canada
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Découvrez nos opportunités d'emploi au Canada dans différents secteurs.
            Des postes qualifiés vous attendent avec des employeurs partenaires.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {filteredJobs.length} Offres Disponibles
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Employeurs Vérifiés
            </Badge>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtrer les offres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un poste ou entreprise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger>
                  <SelectValue placeholder="Secteur d'activité" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Ville" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="grid gap-6">
          {currentJobs.map((job) => (
            <Card key={job.id} className={`hover:shadow-lg transition-shadow ${job.featured === 1 ? 'ring-2 ring-primary/20 bg-primary/5' : 'border-border'}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground">
                      {job.company}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.featured === 1 && (
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Vedette
                      </Badge>
                    )}
                    <Badge variant="outline">{job.sector}</Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {job.type || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTimeDifference(job.posted)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{job.description || 'Aucune description disponible'}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Exigences :</h4>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(job.requirements) ? job.requirements : []).map((req, index) => (
                      <Badge key={index} variant="secondary">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                {isJobAvailable(job.posted) ? (
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    asChild
                  >
                    <Link to={`/jobs/${job.id}`}>
                      Offre disponible
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
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Aucune offre trouvée</h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou consultez toutes nos offres.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pagination Controls */}
        {filteredJobs.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                variant={currentPage === index + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "bg-primary text-primary-foreground" : ""}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">
                Vous ne trouvez pas l'offre idéale ?
              </CardTitle>
              <CardDescription className="text-lg">
                Inscrivez-vous dès maintenant et nous vous contacterons
                dès qu'une offre correspondant à votre profil sera disponible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" asChild>
                <Link to="/register">Créer mon profil candidat</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Jobs;