import { useState } from "react";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export default function AuthButton({ user }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (user) {
    return (
      <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        variant="default"
        size="sm"
        className="bg-orange-500 hover:bg-orange-600 gap-2"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
