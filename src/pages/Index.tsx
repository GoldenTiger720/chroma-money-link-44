
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      
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
    </div>
  );
};

export default Index;
