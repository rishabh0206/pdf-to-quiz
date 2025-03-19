import { Button } from "@/components/ui/button";
import {
  NavigationMenuLink
} from "@/components/ui/navigation-menu";
import { usePathname, useRouter } from "next/navigation";

interface NavigationButtonProps {
  href: string
  text: string
  IconComponent: React.ComponentType<any>
}

const NavigationButton = ({ href, text, IconComponent }: NavigationButtonProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = href === pathname;

  return (
    <NavigationMenuLink asChild active={isActive}>
      <Button
        onClick={() => { router.push(href) }}
        className={`${isActive ? 'bg-accent' : 'bg-primary'} hover:bg-primary/90 text-xl w-36 h-36 flex flex-col items-center justify-center`}
      >
        <IconComponent className="mb-2 icon-size" size={36} absoluteStrokeWidth /> {text}
      </Button>
    </NavigationMenuLink>
  );
};

export default NavigationButton;