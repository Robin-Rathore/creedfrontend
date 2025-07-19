import type React from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import { SignupForm } from "./components/SignupForm";
import { OTPVerification } from "./components/OTPVerification";
import { signupStepAtom } from "./state/signupAtoms";

export const Signup: React.FC = () => {
  const [step] = useAtom(signupStepAtom);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <div className="w-full max-w-md my-4 md:my-6 rounded-xl">
        {/* Logo */}

        <Card className="shadow-xl border-0 bg-card/50 backdrop-blur-sm p-4 rounded-xl">
          <div className="flex justify-center">
            <Link to="/" className="flex items-center">
              {/* <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Package className="h-7 w-7" />
            </div> */}
              <span className="text-2xl font-bold text-gradient">CREED</span>
            </Link>
          </div>

          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {step === "form" ? "Create your account" : "Verify your email"}
            </CardTitle>
            <CardDescription>
              {step === "form"
                ? "Join thousands of happy customers"
                : "Enter the verification code we sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "form" ? <SignupForm /> : <OTPVerification />}

            {step === "form" && (
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary  hover:text-primary-hover font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
