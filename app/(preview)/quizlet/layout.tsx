"use client"

import Loader from "@/components/loader";
import NavigationButton from "@/components/navigation-button";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { BookCheck, Copy, FileText, GraduationCap, Grid2x2Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [title, setTitle] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const title = localStorage.getItem("quiz-title")
    if (title) {
      setTitle(title);
    } else {
      router.push("/");
    }
  }, [])

  const clearPDF = () => {
    localStorage.clear();
    router.push("/");
  };

  if (!title) {
    return <Loader />
  }

  return (
    <div className="space-y-8 p-8 grid  grid-flow-row">
      <div className="items-center flex justify-center">
        <h1 className="text-3xl font-bold text-center text-foreground grow ml-32">
          {title}
        </h1>

        <Button
          onClick={clearPDF}
          className="bg-primary hover:bg-primary/90 float-right"
        >
          <FileText className="mr-2 h-4 w-4" /> Try Another PDF
        </Button>
      </div>

      <div className="items-center flex justify-center">
        <NavigationMenu className="flex">
          <NavigationMenuList className="space-x-8 flex justify-center">
            <NavigationButton href={'/quizlet/quiz'} text={"Quiz"} IconComponent={BookCheck} />
            <NavigationButton href={'/quizlet/flash-cards'} text={"Flash Cards"} IconComponent={Copy} />
            <NavigationButton href={'/quizlet/learn'} text={"Learn"} IconComponent={GraduationCap} />
            <NavigationButton href={'/quizlet/match'} text={"Match"} IconComponent={Grid2x2Check} />
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div>
        {children}
      </div>
    </div>
  );
}
