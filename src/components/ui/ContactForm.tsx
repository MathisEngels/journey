import Link from '@/components/ui/Link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CONTACT_API, CONTACT_EMAIL } from '@/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    message: z.string().min(1),
});

export interface ContactFormProps {
    exitFunction?: () => void;
    noBorder?: boolean;
    translations: {
        cardTitle: string;
        cardDescription: string;
        formName: string;
        formMessagePlaceholder: string;
        formMessageDescription: string;
        formSubmit: string;
        formCancel: string;
        submitLoading: string;
        submitSuccess: string;
        submitError: string;
        copiedToClipboard: string;
    };
}

export function ContactForm(props: ContactFormProps) {
    const { noBorder, translations, exitFunction } = props;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            message: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const promise = fetch(CONTACT_API, { method: 'POST', body: JSON.stringify(data) });

        toast.promise(promise, {
            loading: translations.submitLoading,
            success: translations.submitSuccess,
            error: translations.submitError,
        });
    };

    const onClickEmailAddress = () => {
        navigator.clipboard.writeText(CONTACT_EMAIL);
        toast(translations.copiedToClipboard);
    };

    return (
        <Card className={`min-w-[50%] max-w-[90%] ${noBorder ? 'border-none' : ''}`}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle className="text-2xl">{translations.cardTitle}</CardTitle>
                        <CardDescription>
                            {translations.cardDescription + ' '}
                            <Link href={`mailto:${CONTACT_EMAIL}`} onClick={() => onClickEmailAddress()}>
                                {CONTACT_EMAIL}
                            </Link>
                            .
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{translations.formName}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john.doe@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder={translations.formMessagePlaceholder} className="resize-none" {...field} />
                                    </FormControl>
                                    <FormDescription>{translations.formMessageDescription}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter className="flex justify-around flex-row-reverse">
                        <Button type="submit">{translations.formSubmit}</Button>
                        <Button
                            type="button"
                            variant="outline"
                            className={exitFunction ? '' : 'hidden'}
                            onClick={exitFunction ? () => exitFunction!() : () => {}}
                        >
                            {translations.formCancel}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}

export default ContactForm;
