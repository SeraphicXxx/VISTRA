import { Link, useNavigate } from "react-router-dom";
import React, { ComponentType } from "react";
import { ROUTES } from "/@/config/RoutePaths.js";
import {ChevronRight} from "lucide-react";


export function HyperlinkText({ link, title, icon: Icon }: { link: string, title: string, icon?: ComponentType<{ className?: string; strokeWidth?: number }> }) {
    return(
        <Link
            to={link}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors duration-150 hover:bg-primary/10 hover:text-primaryDark"
        >
            {title}
            {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2} />}
        </Link>
    );
}


interface LinkButtonProps {
    title: string;
    route: string;
    icon: ComponentType<{ className?: string; strokeWidth?: number }>;
    disabled?: boolean;
}

export function LinkButton({
                               title,
                               route,
                               icon: Icon,
                               disabled = false,
                           }: LinkButtonProps) {
    return (
        <Link
            to={route}
            aria-disabled={disabled}
            onClick={(event) => {
                if (disabled) {
                    event.preventDefault();
                }
            }}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 ${
                disabled
                    ? "cursor-not-allowed bg-primary/50"
                    : "bg-primary hover:-translate-y-0.5 hover:bg-primaryDark hover:shadow-md active:translate-y-0"
            }`}
        >
            <Icon
                className="h-3.5 w-3.5"
                strokeWidth={2}
            />

            {title}
        </Link>
    );
}

interface LogoClickableProps {
    className?: string;
    navigateTo?: string;
}

export function LogoClickable({
                                  className = "h-10",
                                  navigateTo = ROUTES.public.home,
                              }: LogoClickableProps) {
    const navigate = useNavigate();

    return (
        <img
            src="/Vistralogo.png"
            alt="Vistra Logo"
            className={`${className} w-auto cursor-pointer object-contain`}
            onClick={() => navigate(navigateTo)}
        />
    );
}