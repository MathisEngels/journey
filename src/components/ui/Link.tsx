import React from 'react';

interface LinkProps {
    children: React.ReactNode;
    href: string;
    onClick?: () => void;
}

function Link(props: LinkProps) {
    const { children, ...rest } = props;
    return (
        <a className="text-standout hover:underline" {...rest}>
            {children}
        </a>
    );
}

export default Link;
