import { endOfExperience } from '@/stores/gameStore';
import { useEffect, useState } from 'react';
import ContactForm, { type ContactFormProps } from './ContactForm';

type EndSceneContactFormProps = Pick<ContactFormProps, 'translations'>;

function EndSceneContactForm(props: EndSceneContactFormProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const unsubcribe = endOfExperience.subscribe((value) => {
            if (value) {
                setTimeout(() => {
                    setVisible(value);
                }, 5000);
            }
        });

        return () => {
            unsubcribe();
        };
    }, []);

    const exitFunction = () => setVisible(false);

    return (
        <section
            className={`absolute w-[100dvw] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-[70] flex justify-center duration-500 transition-opacity ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <ContactForm exitFunction={exitFunction} {...props} />
        </section>
    );
}

export default EndSceneContactForm;
