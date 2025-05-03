"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function AmazonCheckoutPrompt({ clearCart }: { clearCart: () => void }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      if (sessionStorage.getItem("amazonCheckout") === "pending") {
        setOpen(true);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleResponse = (didComplete: boolean) => {
    if (didComplete) {
      clearCart();
      sessionStorage.removeItem("amazonCheckout");
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Did you complete your Amazon purchase?</DialogTitle>
        </DialogHeader>
        <p className="py-4">
          If you finished checkout on Amazon, we’ll clear your cart here.
        </p>
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => handleResponse(false)}>
            No
          </Button>
          <Button onClick={() => handleResponse(true)}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
