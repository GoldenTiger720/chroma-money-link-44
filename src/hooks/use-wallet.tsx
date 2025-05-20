
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, User } from './use-auth';
import { useToast } from "@/hooks/use-toast";

// Types
export type Transaction = {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description?: string;
  timestamp: Date;
};

export type WalletContextType = {
  balance: number;
  transactions: Transaction[];
  topUp: (amount: number) => Promise<boolean>;
  transfer: (recipient: string, amount: number, description?: string) => Promise<boolean>;
  getTransactions: () => Transaction[];
  allTransactions: Transaction[];
  allUsers: User[];
};

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'John Doe',
    recipientId: '2',
    recipientName: 'Jane Smith',
    amount: 250,
    status: 'completed',
    description: 'Dinner payment',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'Jane Smith',
    recipientId: '1',
    recipientName: 'John Doe',
    amount: 500,
    status: 'completed',
    description: 'Rent share',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'John Doe',
    recipientId: '3',
    recipientName: 'Admin User',
    amount: 100,
    status: 'completed',
    description: 'Test payment',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  }
];

// Context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();
  
  // Initialize balance and transactions
  useEffect(() => {
    if (isAuthenticated && user) {
      setBalance(user.balance);
      
      // Filter transactions for this user
      const userTransactions = mockTransactions.filter(
        t => t.senderId === user.id || t.recipientId === user.id
      );
      
      setTransactions(userTransactions);
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [isAuthenticated, user]);
  
  // Top up wallet
  const topUp = async (amount: number): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (amount <= 0) {
      toast({
        title: "Top up failed",
        description: "Amount must be greater than 0.",
        variant: "destructive"
      });
      return false;
    }
    
    // Create a top-up transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      senderId: 'system',
      senderName: 'System Top-up',
      recipientId: user.id,
      recipientName: user.name,
      amount,
      status: 'completed',
      description: 'Wallet top-up',
      timestamp: new Date()
    };
    
    // Update user balance
    const newBalance = balance + amount;
    setBalance(newBalance);
    
    // In a real app, update the user record in the database
    if (user) {
      user.balance = newBalance;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    // Add transaction to history
    mockTransactions.unshift(newTransaction);
    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Top up successful",
      description: `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been added to your wallet.`
    });
    
    return true;
  };
  
  // Transfer money
  const transfer = async (recipientIdentifier: string, amount: number, description?: string): Promise<boolean> => {
    if (!isAuthenticated || !user) return false;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (amount <= 0) {
      toast({
        title: "Transfer failed",
        description: "Amount must be greater than 0.",
        variant: "destructive"
      });
      return false;
    }
    
    if (amount > balance) {
      toast({
        title: "Transfer failed",
        description: "Insufficient funds in your wallet.",
        variant: "destructive"
      });
      return false;
    }
    
    // Find recipient by email or phone
    const recipient = mockUsers.find(u => 
      u.email === recipientIdentifier || 
      u.phone === recipientIdentifier
    );
    
    if (!recipient) {
      toast({
        title: "Transfer failed",
        description: "Recipient not found.",
        variant: "destructive"
      });
      return false;
    }
    
    if (recipient.id === user.id) {
      toast({
        title: "Transfer failed",
        description: "You cannot transfer money to yourself.",
        variant: "destructive"
      });
      return false;
    }
    
    // Create transaction
    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      recipientId: recipient.id,
      recipientName: recipient.name,
      amount,
      status: 'completed',
      description: description || 'Money transfer',
      timestamp: new Date()
    };
    
    // Update balances
    const newSenderBalance = balance - amount;
    setBalance(newSenderBalance);
    
    // In a real app, update both users in the database
    if (user) {
      user.balance = newSenderBalance;
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    recipient.balance += amount;
    
    // Add transaction to history
    mockTransactions.unshift(newTransaction);
    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Transfer successful",
      description: `${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} has been sent to ${recipient.name}.`
    });
    
    return true;
  };
  
  // Get user's transactions
  const getTransactions = (): Transaction[] => {
    if (!user) return [];
    
    return mockTransactions.filter(
      t => t.senderId === user.id || t.recipientId === user.id
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };
  
  // Value to provide
  const value: WalletContextType = {
    balance,
    transactions,
    topUp,
    transfer,
    getTransactions,
    allTransactions: mockTransactions, // For admin access
    allUsers: [...mockUsers]           // For admin access
  };
  
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Access mockUsers from outside the hook
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    balance: 1500,
    isVerified: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+9876543210',
    balance: 2800,
    isVerified: true
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    balance: 5000,
    isAdmin: true,
    isVerified: true
  },
];
