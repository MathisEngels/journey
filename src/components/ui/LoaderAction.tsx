import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { setCurrentTutorialInstruction, setLoaderFade } from '@/gameStore';
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
            setProgressValue((prev) => prev + 100 / 6);
        }
    }, [progress]);

    const onClick = () => {
        setLoaderFade(true);
        setCurrentTutorialInstruction(1);
    };

    return (
        <div className="w-56 h-12">
            {progress !== 100 ? (
                <Progress value={progressValue} className={'rounded-md size-full'} />
            ) : (
                <Button className={'size-full pr-2 text-xl'} disabled={progress !== 100} onClick={onClick}>
                    {children}
                    <ChevronRight size={32} className="animate-bounce-rl" />
                </Button>
            )}
        </div>
    );
}

export default LoaderAction;
