
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/animated-background';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/use-auth';

const Verify = () => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const { verifyAccount, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already verified or not logged in, redirect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.isVerified) {
      navigate('/wallet');
    }
  }, [isAuthenticated, user, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await verifyAccount(code);
      if (success) {
        navigate('/wallet');
      }
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = () => {
    // In a real app, this would trigger an API call to send a new code
    setTimeLeft(60);
    // Use 123456 as the verification code
    console.log("New code: 123456");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <AnimatedBackground />
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Verify your account</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to your email or phone
            <div className="mt-2 p-2 bg-muted rounded-md text-center text-sm">
              <strong className="block">Demo code:</strong> 
              Use "123456" for verification
            </div>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification code</Label>
              <Input 
                id="code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "Verify account"}
            </Button>
            
            <div className="mt-4 text-sm text-center">
              Didn't receive a code?{" "}
              {timeLeft > 0 ? (
                <span className="text-muted-foreground">
                  Resend in {timeLeft}s
                </span>
              ) : (
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={resendCode}
                >
                  Resend code
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Verify;
