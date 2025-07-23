"use client";

import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StartScrollingButton() {
  const router = useRouter();

  const handleClick = async () => {
    track("start_scrolling_button_pressed", {
      source: "homepage",
    });
    router.push("/feed");
  };

  return (
    <Button
      size="lg"
      className="bg-white text-cyan-950 hover:bg-gray-100"
      onClick={handleClick}
    >
      Start Scrolling <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
}
