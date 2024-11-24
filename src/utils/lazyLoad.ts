import dynamic from 'next/dynamic';
import { LoadingSpinner } from '../components/LoadingStates';

export const lazyLoad = (componentPath: string, loadingComponent = LoadingSpinner) => {
  return dynamic(() => import(componentPath), {
    loading: () => loadingComponent,
    ssr: false
  });
};

// Contoh penggunaan:
export const LazyGallery = lazyLoad('../components/Gallery');
export const LazyComments = lazyLoad('../components/Comments');
export const LazyInvitationForm = lazyLoad('../components/InvitationForm');
