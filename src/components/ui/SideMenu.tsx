import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { loaderFade } from '@/stores/gameStore';
import { useStore } from '@nanostores/react';
import { Github, Linkedin, Menu } from 'lucide-react';

interface SideMenuProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function SideMenu(props: SideMenuProps) {
    const { title, description, children } = props;

    const $fade = useStore(loaderFade);

    return (
        <section>
            <Sheet>
                <SheetTrigger asChild className={`absolute top-0 left-0 mt-4 ml-4 bg-background ${$fade && 'shadow-[0px_0px_12px_0px_#00000082]'}`}>
                    <Button variant="ghost" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader className="h-full">
                        <SheetTitle asChild className="mb-4">
                            <header>
                                <h2 className="text-4xl">{title}</h2>
                                <h3 className="font-light">{description}</h3>
                            </header>
                        </SheetTitle>
                        <SheetDescription className="flex flex-col pl-4 text-xl" asChild>
                            <nav>{children}</nav>
                        </SheetDescription>
                        <SheetFooter className="!mt-auto">
                            <a className={buttonVariants({ variant: 'ghost' })} href={'https://github.com/MathisEngels'}>
                                <Github />
                            </a>
                            <a className={buttonVariants({ variant: 'ghost' })} href={'https://fr.linkedin.com/in/mathisengels'}>
                                <Linkedin />
                            </a>
                        </SheetFooter>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </section>
    );
}

export default SideMenu;
