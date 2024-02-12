import { setLoaderFade } from '@/gameStore';
import { useProgress } from '@react-three/drei';
import { ChevronRight } from 'lucide-astro';
import { Button } from './button';
import { Progress } from './progress';

interface LoaderActionProps {
    children: React.ReactNode;
}

function LoaderAction(props: LoaderActionProps) {
    const { children } = props;
    const { progress } = useProgress();

    return (
        <div className="w-56 h-12">
            {progress !== 100 ? (
                <Progress value={progress ? progress : 0} className={'rounded-md size-full'} />
            ) : (
                <Button className={'size-full pr-2 text-xl'} disabled={progress !== 100} onClick={() => setLoaderFade(true)}>
                    {children}
                    <ChevronRight size={32} className="animate-bounce-rl" />
                </Button>
            )}
        </div>
    );
}

export default LoaderAction;
