
import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Shield, Clock, Globe, MessageSquare, ThumbsUp, Zap } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Create refs for scrolling
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  // Handle hash-based navigation
  useEffect(() => {
    if (location.hash === '#features' && featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (location.hash === '#about' && aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div className="relative">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <div className="container px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Instant Money Transfers
              <span className="text-primary block"> with ChromaPay</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Send and receive money instantly with our secure peer-to-peer payment platform. 
              No fees, no hassle, just seamless transactions.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
            {isAuthenticated ? (
              <>
                <Link to="/wallet">
                  <Button size="lg" className="gap-1">
                    Go to Wallet <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/transfer">
                  <Button size="lg" variant="outline">
                    Transfer Money
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="gap-1">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl">
          <div className="flex flex-col items-center p-6 bg-card shadow-sm rounded-lg border">
            <div className="p-2 bg-primary/10 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Instant Transfers</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Send money to anyone instantly. No waiting periods or delays.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-card shadow-sm rounded-lg border">
            <div className="p-2 bg-primary/10 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Secure Transactions</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Advanced encryption and verification for all your financial activities.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-6 bg-card shadow-sm rounded-lg border">
            <div className="p-2 bg-primary/10 rounded-full mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Transaction History</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Keep track of all your transfers with detailed transaction history.
            </p>
          </div>
        </div>
      </div>
      
      {/* Full Features Section */}
      <div id="features" ref={featuresRef} className="py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Features That Empower You
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              ChromaPay gives you all the tools you need to manage your finances securely and efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast Transfers</h3>
                <p className="text-center text-muted-foreground">
                  Send money instantly to anyone, anywhere. Transactions clear within seconds, not days.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Bank-Level Security</h3>
                <p className="text-center text-muted-foreground">
                  Advanced encryption and multi-factor authentication protect your money and personal data.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Global Access</h3>
                <p className="text-center text-muted-foreground">
                  Access your money from anywhere in the world with our cross-border payment solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transaction History</h3>
                <p className="text-center text-muted-foreground">
                  Complete record of all your transactions, providing transparency and easy tracking.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-center text-muted-foreground">
                  Our dedicated support team is available around the clock to assist you with any issues.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="flex flex-col items-center p-6">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <ThumbsUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Zero Fees</h3>
                <p className="text-center text-muted-foreground">
                  Send and receive money without the burden of transaction fees or hidden charges.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Start Using ChromaPay <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div id="about" ref={aboutRef} className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                About ChromaPay
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  ChromaPay was founded with a simple mission: to make money transfers as easy as sending a text message, while maintaining the highest standards of security and privacy.
                </p>
                <p>
                  We believe that financial services should be accessible to everyone, regardless of location or background. Our platform leverages cutting-edge blockchain technology to provide a seamless, secure, and transparent payment experience.
                </p>
                <p>
                  Our team consists of experienced professionals from the fintech and blockchain industries, united by the passion to revolutionize how people transfer and manage their money.
                </p>
              </div>
              
              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground">
                  To create a world where sending money is as simple and secure as sending a message, empowering individuals and businesses to thrive in the digital economy.
                </p>
                
                <h3 className="text-xl font-bold">Our Values</h3>
                <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                  <li><span className="font-medium text-foreground">Security:</span> We never compromise on the security of your data and transactions.</li>
                  <li><span className="font-medium text-foreground">Transparency:</span> We believe in clear, honest communication and operations.</li>
                  <li><span className="font-medium text-foreground">Innovation:</span> We continuously improve our technology to provide the best experience.</li>
                  <li><span className="font-medium text-foreground">Inclusivity:</span> We're building financial tools that work for everyone.</li>
                </ul>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary to-primary/60 opacity-75 blur"></div>
                <div className="relative max-w-md p-8 bg-card rounded-lg border space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold">Why Choose ChromaPay?</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Uncompromised Security</p>
                        <p className="text-sm text-muted-foreground">End-to-end encryption for all transactions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Lightning Fast</p>
                        <p className="text-sm text-muted-foreground">Transfers completed in seconds</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Global Reach</p>
                        <p className="text-sm text-muted-foreground">Send money anywhere in the world</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ThumbsUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">User Friendly</p>
                        <p className="text-sm text-muted-foreground">Intuitive interface for seamless experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
