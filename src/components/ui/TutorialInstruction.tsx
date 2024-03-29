import { Card } from '@/components/ui/card';
import { currentTutorialInstruction } from '@/stores/gameStore';
import { useStore } from '@nanostores/react';

interface TutorialInstructionsProps {
    index: number;
    children: React.ReactNode;
}

function TutorialInstruction(props: TutorialInstructionsProps) {
    const { index, children } = props;

    const $currentTutorialInstruction = useStore(currentTutorialInstruction);

    return (
        <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-opacity duration-500 ease-in-out ${$currentTutorialInstruction === index ? 'opacity-100' : 'opacity-0'}`}
        >
            <Card className={'p-4'}>{children}</Card>
        </div>
    );
}

export default TutorialInstruction;
