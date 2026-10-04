import { LegalPageTemplate } from '@/components/LegalPageTemplate';
import { ROUTES } from '@/app/navigation';
import { legal } from '@/content/legal';

const TermsPage = () => <LegalPageTemplate document={legal.terms} path={ROUTES.terms} />;

export default TermsPage;
