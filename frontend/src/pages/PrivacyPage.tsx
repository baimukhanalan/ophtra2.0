import { LegalPageTemplate } from '@/components/LegalPageTemplate';
import { ROUTES } from '@/app/navigation';
import { legal } from '@/content/legal';

const PrivacyPage = () => <LegalPageTemplate document={legal.privacy} path={ROUTES.privacy} />;

export default PrivacyPage;
