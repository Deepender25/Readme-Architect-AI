'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJWTAuth } from '@/lib/jwt-auth-client';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useJWTAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>; // Or a spinner component
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };

  return WithAuthComponent;
};

export default withAuth;
