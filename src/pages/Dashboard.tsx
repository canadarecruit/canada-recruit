import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  User,
  FileText,
  CreditCard,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Bell,
  MessageSquare,
  Calendar,
  Loader2
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import API_BASE_URL from "../config";

const PAYPAL_CLIENT_ID = "AVr0WUCc2oybYl4msmSsUj-oH31eyRgfpDEmeIRWRwDQxBmrm2uGmZNx4hFXhm1BMA_qMWO8QkYZv5f7";

const Dashboard = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState({});
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', email: '' });
  const [formErrors, setFormErrors] = useState({ firstName: '', lastName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [cardFormErrors, setCardFormErrors] = useState({
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);

  const documentCategories = [
    { name: "CV", allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'] },
    { name: "Passeport", allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'] },
    { name: "Diplômes", allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'] },
    { name: "Certificats", allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'] },
    { name: "Photos d'identité", allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'] }
  ];

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users_by_id`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      const user = data.user || {};
      const createdAt = user.date ? new Date(user.date) : new Date();
      const memberSince = createdAt.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      const profileData = {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Utilisateur',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || 'N/A',
        memberSince,
        status: "Candidature en cours"
      };
      setUserProfile(profileData);
      setProfileForm({ firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '' });
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération du profil.");
    }
  };

  const fetchUserSteps = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/user_steps/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      setSteps(data.user_steps || []);
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des étapes.");
    }
  };

  const fetchDocuments = async () => {
    try {
      if (!userProfile?.id) return;
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/documents/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userProfile.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404 && errorData.message === "Aucun document trouvé pour cet utilisateur") {
          setDocuments(documentCategories.map(category => ({
            name: category.name,
            status: 'missing',
            uploaded: '',
            file_path: ''
          })));
          return;
        }
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      const apiDocuments = data.documents || [];
      const mergedDocuments = documentCategories.map(category => {
        const doc = apiDocuments.find(d => d.document_name === category.name);
        return doc ? {
          name: doc.document_name,
          status: doc.status,
          uploaded: doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
          file_path: doc.file_path
        } : {
          name: category.name,
          status: 'missing',
          uploaded: '',
          file_path: ''
        };
      });
      setDocuments(mergedDocuments);
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des documents. Veuillez réessayer.");
    }
  };

  const fetchPayments = async () => {
    try {
      if (!userProfile?.id) return;
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/payments/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userProfile.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      setPayments(data.payments || []);
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des paiements.");
    }
  };

  const fetchNotifications = async () => {
    try {
      if (!userProfile?.id) return;
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/notifications/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userProfile.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      const validNotifications = (data.notifications || []).filter(notification =>
        notification && notification.id && notification.message && notification.type &&
        ['success', 'warning', 'info'].includes(notification.type)
      );
      setNotifications(validNotifications);
    } catch (err) {
      setError(err.message || "Erreur lors de la récupération des notifications.");
    }
  };

  const fetchCheckDocuments = async () => {
    try {
      if (!userProfile?.id) return;
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/check-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userProfile.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse check-documents:', data);
      if (data.documents) {
        const apiDocuments = data.documents || [];
        const mergedDocuments = documentCategories.map(category => {
          const doc = apiDocuments.find(d => d.document_name === category.name);
          return doc ? {
            name: doc.document_name,
            status: doc.status,
            uploaded: doc.uploaded_date ? new Date(doc.uploaded_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
            file_path: doc.file_path
          } : {
            name: category.name,
            status: 'missing',
            uploaded: '',
            file_path: ''
          };
        });
        setDocuments(mergedDocuments);
      }
      if (data.user_steps) {
        setSteps(data.user_steps || []);
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la vérification des documents.");
    }
  };

  const sendPaymentInfo = async (payment) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/envoie-infos-client-paiement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          payment_id: payment.id,
          description: payment.description,
          amount: 150,
          currency: payment.currency || 'CAD'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse envoie-infos-client-paiement:', data);
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi des informations de paiement.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      await fetchUserProfile();
      if (userProfile?.id) {
        await fetchCheckDocuments();
        await Promise.all([
          fetchUserSteps(),
          fetchDocuments(),
          fetchPayments(),
          fetchNotifications(),
        ]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [navigate, userProfile?.id]);

  const handleUpload = async (categoryName, file) => {
    console.log('handleUpload appelé pour', categoryName, 'Type:', file.type);
    if (!file || !userProfile?.id) {
      console.log('Sortie anticipée: file ou userProfile.id manquant');
      return;
    }

    const category = documentCategories.find(cat => cat.name === categoryName);
    console.log('Catégorie:', category);
    if (!category.allowedTypes.includes(file.type)) {
      setError(`Type de fichier invalide pour ${categoryName}. Types autorisés : ${category.allowedTypes.join(', ')}`);
      return;
    }

    setUploading(prev => ({ ...prev, [categoryName]: true }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userProfile.id.toString());
    formData.append('document_name', categoryName);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      setDocuments(prev => prev.map(doc =>
        doc.name === categoryName ? {
          ...doc,
          status: data.status || 'pending',
          uploaded: data.uploaded_date ? new Date(data.uploaded_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
          file_path: data.file_path || doc.file_path
        } : doc
      ));

      const notificationResponse = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          message: `Document ${categoryName} téléversé`,
          type: "success"
        }),
      });

      if (notificationResponse.ok) {
        const notificationData = await notificationResponse.json();
        if (notificationData.notification && notificationData.notification.id && notificationData.notification.message && notificationData.notification.type) {
          setNotifications(prev => [...prev, notificationData.notification]);
        }
      }

      await fetchCheckDocuments();
      setError(null);
    } catch (err) {
      setError(err.message || "Erreur lors du téléversement du document.");
    } finally {
      setUploading(prev => ({ ...prev, [categoryName]: false }));
    }
  };

  const handlePay = (payment) => {
    setSelectedPayment(payment);
    setPaymentModalOpen(true);
  };

  const handlePayPalPayment = async () => {
    setMaintenanceModalOpen(true);
    await sendPaymentInfo(selectedPayment);
  };

  const validateCardForm = () => {
    const errors = { cardNumber: '', expiry: '', cvv: '' };
    let isValid = true;

    if (!cardDetails.cardNumber.trim()) {
      errors.cardNumber = 'Le numéro de carte est requis';
      isValid = false;
    } else if (!/^\d{16}$/.test(cardDetails.cardNumber)) {
      errors.cardNumber = 'Le numéro de carte doit contenir 16 chiffres';
      isValid = false;
    }

    if (!cardDetails.expiry.trim()) {
      errors.expiry = 'La date d\'expiration est requise';
      isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = 'Format MM/AA requis';
      isValid = false;
    }

    if (!cardDetails.cvv.trim()) {
      errors.cvv = 'Le CVV est requis';
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      errors.cvv = 'Le CVV doit contenir 3 ou 4 chiffres';
      isValid = false;
    }

    setCardFormErrors(errors);
    return isValid;
  };

  const handleCardFormSubmit = async () => {
    if (!validateCardForm()) return;

    setMaintenanceModalOpen(true);
    await sendPaymentInfo(selectedPayment);
    setPaymentModalOpen(false);
    setShowCardForm(false);
    setCardDetails({ cardNumber: '', expiry: '', cvv: '' });
  };

  const handleCardFormCancel = () => {
    setPaymentModalOpen(false);
    setSelectedPayment(null);
    setShowCardForm(false);
    setCardDetails({ cardNumber: '', expiry: '', cvv: '' });
    setError("Paiement annulé.");
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateProfileForm = () => {
    const errors = { firstName: '', lastName: '', email: '' };
    let isValid = true;

    if (!profileForm.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
      isValid = false;
    } else if (profileForm.firstName.length > 50) {
      errors.firstName = 'Le prénom ne doit pas dépasser 50 caractères';
      isValid = false;
    }

    if (!profileForm.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
      isValid = false;
    } else if (profileForm.lastName.length > 50) {
      errors.lastName = 'Le nom ne doit pas dépasser 50 caractères';
      isValid = false;
    }

    if (!profileForm.email.trim()) {
      errors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(profileForm.email)) {
      errors.email = 'Format d\'email invalide';
      isValid = false;
    } else if (profileForm.email.length > 100) {
      errors.email = 'L\'email ne doit pas dépasser 100 caractères';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleProfileUpdate = async () => {
    if (!validateProfileForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      const updatedUser = data.user;
      setUserProfile(prev => ({
        ...prev,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email
      }));
      setIsEditingProfile(false);
      setError(null);

      const notificationResponse = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userProfile.id,
          message: "Profil mis à jour",
          type: "success"
        }),
      });

      if (notificationResponse.ok) {
        const notificationData = await notificationResponse.json();
        if (notificationData.notification && notificationData.notification.id && notificationData.notification.message && notificationData.notification.type) {
          setNotifications(prev => [...prev, notificationData.notification]);
        }
      }
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour du profil.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setFormErrors({ firstName: '', lastName: '', email: '' });
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileForm({
      firstName: userProfile?.firstName || '',
      lastName: userProfile?.lastName || '',
      email: userProfile?.email || ''
    });
    setFormErrors({ firstName: '', lastName: '', email: '' });
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const currentStep = steps.findIndex(step => step.status === 'current') || 1;
  const totalSteps = steps.length || 7;
  const applicationProgress = {
    currentStep,
    totalSteps,
    percentage: Math.round((currentStep / totalSteps) * 100)
  };

  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="pt-4">
              <p className="text-red-600 text-sm">
                Erreur : L'ID client PayPal n'est pas configuré. Veuillez contacter l'administrateur.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, components: 'buttons', currency: 'CAD' }}>
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <main className="container mx-auto px-4 py-8">
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Bonjour, {userProfile ? userProfile.name : 'Chargement...'} 👋
                </h1>
                <p className="text-muted-foreground">
                  Suivez l'avancement de votre candidature pour le Canada
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {userProfile ? userProfile.status : 'Chargement...'}
              </Badge>
            </div>
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Progression de votre candidature</h3>
                  <span className="text-2xl font-bold text-primary">
                    {applicationProgress.percentage}%
                  </span>
                </div>
                <Progress value={applicationProgress.percentage} className="mb-4" />
                <p className="text-muted-foreground">
                  Étape {applicationProgress.currentStep} sur {applicationProgress.totalSteps} complétée
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="documents">Mes documents</TabsTrigger>
              <TabsTrigger value="payments">Paiements</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="profile">Profil</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-[400px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Étapes de la procédure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {steps.length > 0 ? (
                          steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-3">
                              <div className={`p-1 rounded-full ${step.status === 'completed' ? 'bg-green-500' :
                                step.status === 'current' ? 'bg-primary' : 'bg-muted'
                              }`}>
                                {step.status === 'completed' ? (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                ) : step.status === 'current' ? (
                                  <Clock className="h-4 w-4 text-white" />
                                ) : (
                                  <div className="h-4 w-4 rounded-full bg-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium ${step.status === 'current' ? 'text-primary' : ''}`}>
                                  {step.name}
                                </p>
                                {step.date && (
                                  <p className="text-sm text-muted-foreground">{step.date}</p>
                                )}
                              </div>
                              {step.status === 'current' && (
                                <Badge variant="default">En cours</Badge>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground">Aucune étape trouvée.</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="h-[400px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notifications récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            notification && notification.id && notification.message && notification.type ? (
                              <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg border">
                                <AlertCircle className={`h-4 w-4 mt-0.5 ${notification.type === 'success' ? 'text-green-500' :
                                  notification.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">{notification.date || 'N/A'}</p>
                                </div>
                              </div>
                            ) : null
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground">Aucune notification trouvée.</div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-30 flex-col gap-3">
                      <MessageSquare className="h-9 w-9" />
                      Contacter le support
                    </Button>
                    <Button variant="outline" className="h-30 flex-col gap-3">
                      <Calendar className="h-9 w-9" />
                      Prendre rendez-vous
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Gestion des documents
                  </CardTitle>
                  <CardDescription>
                    Téléchargez et gérez tous vos documents requis pour la candidature
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {documents.map((doc) => (
                        <div key={doc.name} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              {doc.uploaded && (
                                <p className="text-sm text-muted-foreground">
                                  Téléchargé le {doc.uploaded}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                doc.status === 'validated'
                                  ? 'bg-green-500 text-white'
                                  : doc.status === 'pending'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-red-500 text-white'
                              }
                            >
                              {doc.status === 'validated' ? 'Validé' : doc.status === 'pending' ? 'En attente' : 'Manquant'}
                            </Badge>
                            <div className="flex gap-1">
                              {doc.uploaded && doc.file_path ? (
                                <Button size="sm" variant="outline" asChild>
                                  <a href={doc.file_path} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4" />
                                  </a>
                                </Button>
                              ) : (
                                <>
                                  <label htmlFor={`upload-${doc.name}`}>
                                    <Button size="sm" variant="default" disabled={uploading[doc.name]} asChild>
                                      <div>
                                        {uploading[doc.name] ? (
                                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                          <Upload className="h-4 w-4 mr-2" />
                                        )}
                                        {uploading[doc.name] ? 'Téléversement...' : 'Téléverser'}
                                      </div>
                                    </Button>
                                  </label>
                                  <Input
                                    id={`upload-${doc.name}`}
                                    type="file"
                                    accept={documentCategories.find(cat => cat.name === doc.name)?.allowedTypes.join(',')}
                                    onChange={(e) => handleUpload(doc.name, e.target.files[0])}
                                    className="hidden"
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Historique des paiements
                  </CardTitle>
                  <CardDescription>
                    Consultez l'état de vos paiements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {payments.length > 0 ? (
                        payments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{payment.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {payment.date || "En attente"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold">{payment.amount} {payment.currency}</span>
                              <Badge variant={
                                payment.status === 'paid' ? 'default' :
                                  payment.status === 'failed' ? 'destructive' : 'secondary'
                              }>
                                {payment.status === 'paid' ? 'Payé' :
                                  payment.status === 'failed' ? 'Échoué' : 'En attente'}
                              </Badge>
                              {payment.status === 'pending' && (
                                <Dialog open={paymentModalOpen && selectedPayment?.id === payment.id} onOpenChange={(open) => {
                                  if (!open) {
                                    setPaymentModalOpen(false);
                                    setShowCardForm(false);
                                    setSelectedPayment(null);
                                    setCardDetails({ cardNumber: '', expiry: '', cvv: '' });
                                  }
                                }}>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="default" onClick={() => handlePay(payment)}>
                                      Payer
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Paiement pour {selectedPayment?.description}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <p>Montant : {selectedPayment?.amount} {selectedPayment?.currency}</p>
                                      <div className="space-y-2">
                                        <Button
                                          className="w-full"
                                          onClick={() => setShowCardForm(true)}
                                          disabled={showCardForm}
                                        >
                                          Payer par carte
                                        </Button>
                                        {!showCardForm && (
                                          <PayPalButtons
                                            style={{ layout: "horizontal" }}
                                            fundingSource={FUNDING.PAYPAL}
                                            createOrder={(data, actions) => {
                                              return actions.order.create({
                                                purchase_units: [
                                                  {
                                                    amount: {
                                                      value: selectedPayment?.amount.toString(),
                                                      currency_code: selectedPayment?.currency || "CAD",
                                                    },
                                                  },
                                                ],
                                              });
                                            }}
                                            onApprove={async (data, actions) => {
                                              await handlePayPalPayment();
                                            }}
                                            onError={(err) => {
                                              setError("Erreur lors du paiement PayPal.");
                                              console.error("Erreur PayPal:", err);
                                            }}
                                          />
                                        )}
                                      </div>
                                      {showCardForm && (
                                        <div className="space-y-4">
                                          <div>
                                            <label className="text-sm font-medium">Numéro de carte</label>
                                            <Input
                                              name="cardNumber"
                                              value={cardDetails.cardNumber}
                                              onChange={handleCardInputChange}
                                              placeholder="1234 5678 9012 3456"
                                              className={cardFormErrors.cardNumber ? 'border-red-500' : ''}
                                            />
                                            {cardFormErrors.cardNumber && (
                                              <p className="text-red-500 text-sm mt-1">{cardFormErrors.cardNumber}</p>
                                            )}
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <label className="text-sm font-medium">Expiration (MM/AA)</label>
                                              <Input
                                                name="expiry"
                                                value={cardDetails.expiry}
                                                onChange={handleCardInputChange}
                                                placeholder="MM/AA"
                                                className={cardFormErrors.expiry ? 'border-red-500' : ''}
                                              />
                                              {cardFormErrors.expiry && (
                                                <p className="text-red-500 text-sm mt-1">{cardFormErrors.expiry}</p>
                                              )}
                                            </div>
                                            <div>
                                              <label className="text-sm font-medium">CVV</label>
                                              <Input
                                                name="cvv"
                                                value={cardDetails.cvv}
                                                onChange={handleCardInputChange}
                                                placeholder="123"
                                                className={cardFormErrors.cvv ? 'border-red-500' : ''}
                                              />
                                              {cardFormErrors.cvv && (
                                                <p className="text-red-500 text-sm mt-1">{cardFormErrors.cvv}</p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex gap-4">
                                            <Button onClick={handleCardFormSubmit}>Soumettre</Button>
                                            <Button variant="outline" onClick={handleCardFormCancel}>Annuler</Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground">Aucun paiement trouvé.</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Centre de messages
                  </CardTitle>
                  <CardDescription>
                    Communiquez avec notre équipe support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun message</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez aucun message pour le moment.
                    </p>
                    <Button>Nouveau message</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Mon profil
                  </CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {isEditingProfile ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Prénom</label>
                              <Input
                                name="firstName"
                                value={profileForm.firstName}
                                onChange={handleProfileChange}
                                placeholder="Entrez votre prénom"
                                className={formErrors.firstName ? 'border-red-500' : ''}
                              />
                              {formErrors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium">Nom</label>
                              <Input
                                name="lastName"
                                value={profileForm.lastName}
                                onChange={handleProfileChange}
                                placeholder="Entrez votre nom"
                                className={formErrors.lastName ? 'border-red-500' : ''}
                              />
                              {formErrors.lastName && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <Input
                                name="email"
                                type="email"
                                value={profileForm.email}
                                onChange={handleProfileChange}
                                placeholder="Entrez votre email"
                                className={formErrors.email ? 'border-red-500' : ''}
                              />
                              {formErrors.email && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              onClick={handleProfileUpdate}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Enregistrement...
                                </>
                              ) : (
                                'Enregistrer'
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={isSubmitting}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Nom complet</label>
                              <p className="text-lg">{userProfile ? userProfile.name : 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Email</label>
                              <p className="text-lg">{userProfile ? userProfile.email : 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Membre depuis</label>
                              <p className="text-lg">{userProfile ? userProfile.memberSince : 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Statut</label>
                              <p className="text-lg">{userProfile ? userProfile.status : 'N/A'}</p>
                            </div>
                          </div>
                          <div className="pt-4">
                            <Button variant="outline" onClick={handleEditProfile}>
                              Modifier le profil
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Dialog open={maintenanceModalOpen} onOpenChange={setMaintenanceModalOpen}>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Maintenance en cours</DialogTitle>
              </DialogHeader>
              <div className="py-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-semibold">
                  Le système de paiement est actuellement en maintenance.
                </p>
                <p className="text-md text-muted-foreground mt-2">
                  Le support technique de Canada Recruit vous contactera sous peu pour vous fournir les instructions de paiement. Merci de votre patience.
                </p>
                <Button
                  className="mt-6"
                  onClick={() => setMaintenanceModalOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
        <Footer />
      </div>
    </PayPalScriptProvider>
  );
};

export default Dashboard;