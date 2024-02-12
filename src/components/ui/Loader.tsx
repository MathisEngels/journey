import { loaderFade } from '@/gameStore';
import { useStore } from '@nanostores/react';

interface LoaderProps {
    children: React.ReactNode;
}

function Loader(props: LoaderProps) {
    const { children } = props;

    const $fade = useStore(loaderFade);

    return (
        <section
            className={`bg-background h-dvh w-dvw absolute top-0 left-0 flex items-center justify-center duration-500 transition-opacity text-center text-white font-semibold ${$fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <div className="flex flex-col justify-evenly items-center h-full w-3/4">{children}</div>
        </section>
    );
}

export default Loader;
