import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Users, Zap } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Partner Status Tracker
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Share your status with your partner in real-time
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="font-medium">Connect with Partner</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Link accounts using invitation codes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg border">
            <Zap className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="font-medium">Real-time Updates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">See status changes instantly</p>
            </div>
          </div>
        </div>

        {/* Authentication Options */}
        <div className="max-w-sm mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Get Started</CardTitle>
              <CardDescription className="text-center">
                Create an account to start tracking with your partner
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/register">
                <Button className="w-full" size="lg">
                  Create Account
                </Button>
              </Link>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?
                </p>
                <Link href="/login">
                  <Button className="w-full mt-2" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}