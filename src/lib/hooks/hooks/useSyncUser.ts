import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUserStore } from "@/lib/stores/userUserStore";
import toast from "react-hot-toast";

export const useSyncUser = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const { userData, setUserData } = useUserStore();

    useEffect(() => {
        const sync = async () => {
            if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress || userData)
                return;

            try {
                const res = await fetch("/api/user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
                });

                const result = await res.json();

                if (res.ok && result.success) {
                    setUserData({
                        id: user.id,
                        email: user.primaryEmailAddress.emailAddress,
                        firstName: user.firstName ?? undefined,
                        lastName: user.lastName ?? undefined,
                    });
                } else {
                    console.error("Sync failed:", result.message);
                }
            } catch (err) {
                console.error("Sync error:", err);
                toast.error("Failed to sync user");
            }
        };

        sync();
    }, [user, isSignedIn, userData, setUserData]);
};
