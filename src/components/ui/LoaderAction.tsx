import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { setCurrentTutorialInstruction, setLoaderFade } from '@/stores/gameStore';
import { loaded } from '@/stores/uiStore';
import { useProgress } from '@react-three/drei';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoaderActionProps {
    children: React.ReactNode;
}

function LoaderAction(props: LoaderActionProps) {
    const { children } = props;
    const { progress } = useProgress();
    const [progressValue, setProgressValue] = useState(0);

    useEffect(() => {
        if (progress === 100) {
            setProgressValue((prev) => {
                return prev + 100 / (5 + 1);
            });
        }
    }, [progress]);

    useEffect(() => {
        const unsubscribe = loaded.subscribe((value) => {
            if (value === 1) setProgressValue(100);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const onClick = () => {
        setLoaderFade(true);
        setCurrentTutorialInstruction(1);
    };

    return (
        <div className="w-56 h-12">
            {progressValue !== 100 ? (
                <Progress value={progressValue} className={'animate-pulse rounded-md size-full'} />
            ) : (
                <Button className={'size-full pr-2 text-xl'} disabled={progressValue !== 100} onClick={onClick}>
                    {children}
                    <ChevronRight size={32} className="animate-bounce-rl" />
                </Button>
            )}
        </div>
    );
}

export default LoaderAction;
