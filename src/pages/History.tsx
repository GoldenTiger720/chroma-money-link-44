
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUp, Calendar, Search } from "lucide-react";
import { AnimatedBackground } from '@/components/animated-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/hooks/use-auth';
import { useWallet, Transaction } from '@/hooks/use-wallet';

const History = () => {
  const { user, isAuthenticated } = useAuth();
  const { getTransactions } = useWallet();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Get all transactions
  const allTransactions = getTransactions();
  
  // Apply filters
  const filteredTransactions = allTransactions.filter((tx) => {
    // Text search
    const searchMatch = 
      tx.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type filter
    let typeMatch = true;
    if (filterType === 'sent' && tx.senderId !== user?.id) {
      typeMatch = false;
    } else if (filterType === 'received' && tx.recipientId !== user?.id) {
      typeMatch = false;
    }
    
    return searchMatch && typeMatch;
  });

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Group transactions by date (for day headers)
  const groupByDate = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    
    transactions.forEach((tx) => {
      const date = new Date(tx.timestamp);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(tx);
    });
    
    // Convert to array of [date, transactions]
    return Object.entries(groups).sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  };
  
  const groupedTransactions = groupByDate(filteredTransactions);
  
  // Format date for group headers
  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (date.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <AnimatedBackground />
      
      <div className="container px-4 pt-8">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View all your past transactions</CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="w-full md:w-48">
                <Select
                  value={filterType}
                  onValueChange={setFilterType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="received">Received</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Transactions list */}
            <div className="space-y-6">
              {groupedTransactions.length > 0 ? (
                groupedTransactions.map(([dateKey, txs]) => (
                  <div key={dateKey}>
                    {/* Date header */}
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium">{formatGroupDate(dateKey)}</h4>
                    </div>
                    
                    {/* Transactions for this date */}
                    <div className="space-y-2">
                      {txs.map((tx) => (
                        <div 
                          key={tx.id} 
                          className="flex items-center justify-between p-4 rounded-lg border bg-card"
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
                            <p className="text-xs text-muted-foreground">
                              {formatDate(tx.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No matching transactions found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
