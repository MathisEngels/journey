interface SideMenuLinkProps {
    href: string;
    title: string;
}

export function SideMenuLink(props: SideMenuLinkProps) {
    const { href, title } = props;

    return (
        <li>
            <a
                className={
                    "w-fit relative after:block after:content-[''] after:absolute after:h-[3px] after:bg-standout after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center"
                }
                href={href}
            >
                {title}
            </a>
        </li>
    );
}

export default SideMenuLink;
