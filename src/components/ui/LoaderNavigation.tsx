import { loaded } from '@/stores/uiStore';
import { useEffect, useState } from 'react';

interface LoaderNavigationProps {
    children: React.ReactNode;
}

export function LoaderNavigation(props: LoaderNavigationProps) {
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        const unsubscribe = loaded.subscribe((value) => {
            if (value === 1) setLoaded(true);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return <div className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>{props.children}</div>;
}

export default LoaderNavigation;
