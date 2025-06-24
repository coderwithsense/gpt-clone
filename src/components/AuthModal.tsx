"use client";

import { useState } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignalIcon, SignIn } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onModeChange: (mode: "login" | "signup") => void;
}

export const AuthModal = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
}: AuthModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (mode === "signup") {
        if (awaitingVerification) {
          const result = await signUp?.attemptEmailAddressVerification({
            code,
          });
          if (result?.status === "complete") {
            await setActive({ session: result.createdSessionId });
            onClose();
          } else {
            setError("Invalid code. Try again.");
          }
        } else {
          await signUp?.create({ emailAddress: email, password });
          await signUp?.prepareEmailAddressVerification({
            strategy: "email_code",
          });
          setAwaitingVerification(true);
        }
      } else {
        const result = await signIn?.create({ identifier: email, password });
        if (result?.status === "complete") {
          await setActive({ session: result.createdSessionId });
          onClose();
        } else {
          setError("Additional steps required.");
        }
      }
    } catch (err: unknown) {
      if (isClerkAPIResponseError(err)) {
        setError(err.errors[0]?.message || "Authentication failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const title =
    mode === "signup"
      ? awaitingVerification
        ? "Verify your email"
        : "Create an account"
      : "Welcome back";

  const subtitle =
    mode === "signup"
      ? awaitingVerification
        ? "Enter the verification code sent to your email."
        : "Sign up to continue using the app."
      : "Log in to access your account.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl">
        <div className="px-8 py-10">
          <div className="text-center mb-8">
            <DialogTitle>
              <p className="text-2xl font-semibold text-chatgpt-gray-900 mb-2">
                {title}
              </p>
            </DialogTitle>
            <p className="text-chatgpt-gray-600 text-sm">{subtitle}</p>
          </div>

          {!awaitingVerification && (
            <>
              <div className="space-y-3 mb-6">
                <OAuthButton
                  mode={mode}
                  provider="google"
                  label="Continue with Google"
                  icon="🟢"
                />
                {/* <OAuthButton
                  mode={mode}
                  provider="microsoft"
                  label="Continue with Microsoft"
                  icon="🪟"
                />
                <OAuthButton
                  mode={mode}
                  provider="apple"
                  label="Continue with Apple"
                  icon="🍎"
                /> */}
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-chatgpt-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-chatgpt-gray-500">
                    OR
                  </span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && awaitingVerification ? (
              <Input
                type="text"
                placeholder="Verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-12 px-4 border border-chatgpt-gray-300 rounded-lg focus:border-chatgpt-green-500 focus:ring-1 focus:ring-chatgpt-green-500 text-sm"
                required
              />
            ) : (
              <>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border border-chatgpt-gray-300 rounded-lg focus:border-chatgpt-green-500 focus:ring-1 focus:ring-chatgpt-green-500 text-sm"
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 border border-chatgpt-gray-300 rounded-lg focus:border-chatgpt-green-500 focus:ring-1 focus:ring-chatgpt-green-500 text-sm"
                  required
                />
              </>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-chatgpt-green-600 hover:bg-chatgpt-green-500 text-white font-medium rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : mode === "signup"
                ? awaitingVerification
                  ? "Verify"
                  : "Sign up"
                : "Log in"}
            </Button>
          </form>

          {!awaitingVerification && (
            <div className="text-center text-sm text-chatgpt-gray-600 mt-4">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => onModeChange("login")}
                    className="text-chatgpt-green-600 hover:underline"
                  >
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <button
                    onClick={() => onModeChange("signup")}
                    className="text-chatgpt-green-600 hover:underline"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          )}

          <div id="clerk-captcha" className="mt-6" />

          <div className="text-center text-xs text-chatgpt-gray-500 mt-6">
            <a href="#" className="hover:underline">
              Terms of Use
            </a>{" "}
            |{" "}
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// // Reusable OAuth Button
// const OAuthButton = ({
//   provider,
//   label,
//   icon,
// }: {
//   provider: string;
//   label: string;
//   icon: string;
// }) => {
//   const { signIn } = useSignIn();

//   const handleOAuth = async () => {
//     if (!signIn) return;
//     try {
//       await signIn.authenticateWithRedirect({
//         strategy: `oauth_${provider}`,
//         redirectUrl: "/",
//       });
//     } catch (err) {
//       console.error(`${provider} OAuth failed`, err);
//     }
//   };

//   return (
//     <Button
//       type="button"
//       variant="outline"
//       onClick={handleOAuth}
//       className="w-full h-12 flex items-center justify-center space-x-2 border rounded-full text-sm"
//     >
//       <span>{icon}</span>
//       <span>{label}</span>
//     </Button>
//   );
// };

const OAuthButton = ({
  mode,
  provider,
  label,
  icon,
}: {
  mode: "login" | "signup";
  provider: string;
  label: string;
  icon: string;
}) => {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const handleOAuth = async () => {
    const auth = mode === "signup" ? signUp : signIn;
    if (!auth) return;

    try {
      await auth.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/",
      });
    } catch (err) {
      console.error(`${provider} OAuth failed`, err);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleOAuth}
      className="w-full h-12 flex items-center justify-center space-x-2 border rounded-full text-sm"
    >
      <span>
        <SignalIcon />
      </span>
      <span>{label}</span>
    </Button>
  );
};
