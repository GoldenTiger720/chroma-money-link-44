
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUp, Clock } from "lucide-react";
import { AnimatedBackground } from '@/components/animated-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Wallet = () => {
  const { user, isAuthenticated } = useAuth();
  const { balance, transactions, topUp } = useWallet();
  const navigate = useNavigate();
  
  const [isTopupOpen, setIsTopupOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topupAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await topUp(amount);
      if (success) {
        setIsTopupOpen(false);
        setTopupAmount('');
      }
    } catch (error) {
      console.error('Topup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen pb-16">
      <AnimatedBackground />
      
      <div className="container px-4 pt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main wallet card */}
          <div className="w-full md:w-2/3">
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 z-0"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl">Your Wallet</CardTitle>
                <CardDescription>Manage your balance and transactions</CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="text-muted-foreground">Current balance</p>
                    <h3 className="text-4xl font-bold">
                      ${balance.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </h3>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => setIsTopupOpen(true)}
                      className="gap-1"
                    >
                      <ArrowUp className="h-4 w-4" /> Top Up
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/transfer')}
                      className="gap-1"
                    >
                      <ArrowRight className="h-4 w-4" /> Send
                    </Button>
                  </div>
                </div>
                
                {/* Transaction history section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold">Recent Transactions</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/history')}
                    >
                      View all
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((tx) => (
                        <div 
                          key={tx.id} 
                          className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full 
                              ${tx.senderId === user?.id ? 'bg-destructive/10' : 'bg-primary/10'}`
                            }>
                              {tx.senderId === user?.id ? (
                                <ArrowRight className="h-4 w-4" />
                              ) : (
                                <ArrowUp className="h-4 w-4" />
                              )}
                            </div>
                            
                            <div>
                              <p className="font-medium">
                                {tx.senderId === user?.id ? `To ${tx.recipientName}` : `From ${tx.senderName}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tx.description || 'Money transfer'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className={`font-medium 
                              ${tx.senderId === user?.id ? 'text-destructive' : 'text-primary'}`
                            }>
                              {tx.senderId === user?.id ? '-' : '+'}
                              ${tx.amount.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </p>
                            <p className="text-xs flex items-center justify-end gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(tx.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-muted-foreground">No transactions yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Side panel */}
          <div className="w-full md:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => navigate('/transfer')} className="w-full justify-start gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Send Money
                </Button>
                <Button variant="outline" onClick={() => navigate('/history')} className="w-full justify-start gap-2">
                  <Clock className="h-4 w-4" />
                  Transaction History
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Active
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Top up dialog */}
      <Dialog open={isTopupOpen} onOpenChange={setIsTopupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Top Up Wallet</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTopup}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  min="1"
                  step="any"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsTopupOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Top Up"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Wallet;
