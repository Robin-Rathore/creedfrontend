//@ts-nocheck
import type React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, FastForwardIcon, Package, User } from "lucide-react";
import { LoginForm } from "./components/LoginForm";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@/queries/hooks/auth/useAuth";
import { toast } from "react-hot-toast";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const googleLoginMutation = useGoogleLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <div className="w-full my-4 md:my-6 max-w-md rounded-xl">
        <Card className="shadow-xl p-4 border-0 bg-card/50 backdrop-blur-sm rounded-xl">
          <CardHeader className="space-y-1 text-center ">
            <div className="flex justify-center mb-8">
              <Link to="/" className="flex items-center space-x-2">
                {/* <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                  <Package className="h-7 w-7" />
                </div> */}
                <span className="text-2xl font-bold text-gradient">CREED</span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue shopping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <div className="flex justify-center mt-4 w-full">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      await googleLoginMutation.mutateAsync({
                        credential: credentialResponse.credential,
                      });
                      navigate("/");
                    } catch (err) {
                      // Handled by mutation or toast
                    }
                  }
                }}
                onError={() => {
                  toast.error("Google authentication failed");
                }}
                useOneTap
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center my-8">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Premium Products</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <FastForwardIcon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Fast Shipping</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Secure Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};
