import { setLoaded } from '@/stores/uiStore';
import { useEffect } from 'react';

export function FinishLoading() {
    useEffect(() => {
        setLoaded();
    }, []);

    return <></>;
}

export default FinishLoading;
