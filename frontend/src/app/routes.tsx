import { lazy } from 'react';
import { Navigate, useParams, type RouteObject } from 'react-router-dom';
import { ROUTES } from './navigation';

/**
 * Route table with per-page code splitting.
 *
 * Only the home page and the shell are in the initial bundle; every other page
 * is fetched on navigation, which is what keeps first load under the 2-second
 * budget.
 */

const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ManagementPage = lazy(() => import('@/pages/ManagementPage'));
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'));
const DoctorDetailPage = lazy(() => import('@/pages/DoctorDetailPage'));
const DepartmentsPage = lazy(() => import('@/pages/DepartmentsPage'));
const DiagnosticsPage = lazy(() => import('@/pages/DiagnosticsPage'));
const TreatmentPage = lazy(() => import('@/pages/TreatmentPage'));
const LaserPage = lazy(() => import('@/pages/LaserPage'));
const CataractPage = lazy(() => import('@/pages/CataractPage'));
const PediatricPage = lazy(() => import('@/pages/PediatricPage'));
const OpticalPage = lazy(() => import('@/pages/OpticalPage'));
const ProgramsPage = lazy(() => import('@/pages/ProgramsPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const PromotionsPage = lazy(() => import('@/pages/PromotionsPage'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const NewsDetailPage = lazy(() => import('@/pages/NewsDetailPage'));
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ReviewsPage = lazy(() => import('@/pages/ReviewsPage'));
const AppointmentPage = lazy(() => import('@/pages/AppointmentPage'));
const ContactsPage = lazy(() => import('@/pages/ContactsPage'));
const VacanciesPage = lazy(() => import('@/pages/VacanciesPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const FounderPage = lazy(() => import('@/pages/FounderPage'));
const ExpertsPage = lazy(() => import('@/pages/ExpertsPage'));
const PartnershipsPage = lazy(() => import('@/pages/PartnershipsPage'));
const ServicesIndexPage = lazy(() => import('@/pages/ServicesIndexPage'));
const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'));
const InternationalPage = lazy(() => import('@/pages/InternationalPage'));
const SecondOpinionPage = lazy(() => import('@/pages/SecondOpinionPage'));
const ConsultationPage = lazy(() => import('@/pages/ConsultationPage'));
const SciencePage = lazy(() => import('@/pages/SciencePage'));
const AcademyPage = lazy(() => import('@/pages/AcademyPage'));
const KnowledgePage = lazy(() => import('@/pages/KnowledgePage'));
const AuthorPage = lazy(() => import('@/pages/AuthorPage'));
const MediaCenterPage = lazy(() => import('@/pages/MediaCenterPage'));

/** Old article URLs live on inside the knowledge base. */
const ArticleRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`${ROUTES.knowledge}/${slug ?? ''}`} replace />;
};

export const routes: RouteObject[] = [
  { path: ROUTES.home, element: <HomePage /> },
  { path: ROUTES.about, element: <AboutPage /> },
  { path: ROUTES.management, element: <ManagementPage /> },
  { path: ROUTES.doctors, element: <DoctorsPage /> },
  { path: `${ROUTES.doctors}/:slug`, element: <DoctorDetailPage /> },
  { path: ROUTES.departments, element: <DepartmentsPage /> },
  { path: ROUTES.diagnostics, element: <DiagnosticsPage /> },
  { path: ROUTES.treatment, element: <TreatmentPage /> },
  { path: ROUTES.laser, element: <LaserPage /> },
  { path: ROUTES.cataract, element: <CataractPage /> },
  { path: ROUTES.pediatric, element: <PediatricPage /> },
  { path: ROUTES.optical, element: <OpticalPage /> },
  { path: ROUTES.programs, element: <ProgramsPage /> },
  { path: ROUTES.pricing, element: <PricingPage /> },
  { path: ROUTES.promotions, element: <PromotionsPage /> },
  { path: ROUTES.news, element: <NewsPage /> },
  { path: `${ROUTES.news}/:slug`, element: <NewsDetailPage /> },
  { path: ROUTES.articles, element: <Navigate to={ROUTES.knowledge} replace /> },
  { path: `${ROUTES.articles}/:slug`, element: <ArticleRedirect /> },
  { path: ROUTES.knowledge, element: <KnowledgePage /> },
  { path: `${ROUTES.knowledge}/:slug`, element: <ArticleDetailPage /> },
  { path: `${ROUTES.authors}/:slug`, element: <AuthorPage /> },
  { path: ROUTES.founder, element: <FounderPage /> },
  { path: ROUTES.experts, element: <ExpertsPage /> },
  { path: ROUTES.partnerships, element: <PartnershipsPage /> },
  { path: ROUTES.services, element: <ServicesIndexPage /> },
  { path: `${ROUTES.services}/:slug`, element: <ServiceDetailPage /> },
  { path: ROUTES.international, element: <InternationalPage /> },
  { path: ROUTES.secondOpinion, element: <SecondOpinionPage /> },
  { path: ROUTES.consultation, element: <ConsultationPage /> },
  { path: ROUTES.science, element: <SciencePage /> },
  { path: ROUTES.academy, element: <AcademyPage /> },
  { path: ROUTES.media, element: <MediaCenterPage /> },
  { path: ROUTES.faq, element: <FaqPage /> },
  { path: ROUTES.reviews, element: <ReviewsPage /> },
  { path: ROUTES.appointment, element: <AppointmentPage /> },
  { path: ROUTES.contacts, element: <ContactsPage /> },
  { path: ROUTES.vacancies, element: <VacanciesPage /> },
  { path: ROUTES.privacy, element: <PrivacyPage /> },
  { path: ROUTES.terms, element: <TermsPage /> },
  { path: ROUTES.account, element: <AccountPage /> },
  { path: ROUTES.admin, element: <AdminPage /> },
  { path: '*', element: <NotFoundPage /> },
];
