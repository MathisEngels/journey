import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerPortal } from '@/components/ui/drawer';
import { TRIGGER_POINTS_POI } from '@/config';
import { currentPOI, setEndOfExperience } from '@/stores/gameStore';
import { useStore } from '@nanostores/react';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type POIKey =
    | 'poi-1-title'
    | 'poi-1'
    | 'poi-2-title'
    | 'poi-2'
    | 'poi-3-title'
    | 'poi-3'
    | 'poi-4-title'
    | 'poi-4'
    | 'poi-5-title'
    | 'poi-5'
    | 'poi-6-title'
    | 'poi-6'
    | 'poi-7-title'
    | 'poi-7'
    | 'learn-more';

type POIDrawerProps = {
    [key in POIKey]?: React.ReactNode;
};

export function POIDrawer(props: POIDrawerProps) {
    const $currentPOI = useStore(currentPOI);
    const [title, setTitle] = useState<React.ReactNode>(null);
    const [content, setContent] = useState<React.ReactNode>(null);

    useEffect(() => {
        if ($currentPOI === -1) return;

        setTitle(props[`poi-${$currentPOI + 1}-title` as POIKey]);
        setContent(props[`poi-${$currentPOI + 1}` as POIKey]);
    }, [$currentPOI]);

    const triggerEndOfExperience = () => {
        setEndOfExperience(true);
    };

    return (
        <section>
            <Drawer open={$currentPOI !== -1} dismissible={false}>
                <DrawerPortal>
                    <DrawerContent className="max-w-2xl mx-auto">
                        <DrawerHeader className="overflow-auto">
                            <DrawerDescription>{title}</DrawerDescription>

                            {$currentPOI !== TRIGGER_POINTS_POI.length - 1 ? (
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger asChild>
                                            <Button variant="outline" className="group pointer-events-auto">
                                                {props['learn-more']}
                                                <ChevronDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                            </Button>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <article className="prose prose-invert">{content}</article>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ) : (
                                <Button variant="outline" className="group pointer-events-auto" onClick={triggerEndOfExperience}>
                                    {content}
                                </Button>
                            )}
                        </DrawerHeader>
                    </DrawerContent>
                </DrawerPortal>
            </Drawer>
        </section>
    );
}

export default POIDrawer;
