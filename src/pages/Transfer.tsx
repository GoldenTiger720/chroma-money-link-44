
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AnimatedBackground } from '@/components/animated-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from "@/hooks/use-toast";

const Transfer = () => {
  const { user, isAuthenticated } = useAuth();
  const { balance, transfer } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [transferSuccess, setTransferSuccess] = useState(false);
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Convert amount to a number for validation
  const amountValue = parseFloat(amount);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate recipient
    if (!recipient) {
      toast({
        title: "Invalid recipient",
        description: "Please enter a recipient email or phone number.",
        variant: "destructive"
      });
      return;
    }
    
    // Step 1 is for details, step 2 is for confirmation
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await transfer(recipient, amountValue, description);
      if (success) {
        setTransferSuccess(true);
      }
    } catch (error) {
      console.error('Transfer error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setStep(1);
    setRecipient('');
    setAmount('');
    setDescription('');
    setTransferSuccess(false);
  };

  return (
    <div className="min-h-screen pb-16">
      <AnimatedBackground />
      
      <div className="container px-4 pt-8">
        <Card className="max-w-lg mx-auto">
          <CardHeader className="text-center">
            <CardTitle>{transferSuccess ? 'Transfer Complete' : 'Send Money'}</CardTitle>
            <CardDescription>
              {transferSuccess 
                ? 'Your money has been sent successfully.' 
                : 'Transfer funds to another ChromaPay user.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {transferSuccess ? (
              <div className="flex flex-col items-center py-6">
                <div className="h-16 w-16 rounded-full flex items-center justify-center bg-primary/10 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                
                <h3 className="text-xl font-semibold mb-1">Transfer successful!</h3>
                <p className="text-muted-foreground mb-4">Your money has been sent.</p>
                
                <div className="w-full p-4 rounded-lg bg-muted/50 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">${amountValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-semibold">{recipient}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Note</span>
                      <span className="font-semibold">{description}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={handleReset}>New Transfer</Button>
                  <Button variant="outline" onClick={() => navigate('/wallet')}>Back to Wallet</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {step === 1 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipient">Recipient Email or Phone</Label>
                      <Input
                        id="recipient"
                        type="text"
                        placeholder="email@example.com or phone number"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Demo recipients: jane@example.com or john@example.com
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        min="1"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Your balance: ${balance.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        placeholder="What's this payment for?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Continue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h3 className="text-lg font-semibold mb-4">Confirm Transfer</h3>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Recipient</span>
                        <span className="font-semibold">{recipient}</span>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-semibold">${amountValue.toFixed(2)}</span>
                      </div>
                      
                      {description && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Description</span>
                          <span className="font-semibold">{description}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep(1)}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          "Processing..."
                        ) : (
                          <span className="flex items-center gap-1">
                            Confirm <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Transfer;
