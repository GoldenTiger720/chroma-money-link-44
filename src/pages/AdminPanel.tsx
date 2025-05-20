
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/animated-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/use-auth';
import { useWallet, Transaction } from '@/hooks/use-wallet';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const AdminPanel = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { allUsers, allTransactions } = useWallet();
  const navigate = useNavigate();
  
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [txSearchTerm, setTxSearchTerm] = useState('');
  
  // Redirect if not authenticated or not admin
  React.useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Filter users
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );
  
  // Filter transactions
  const filteredTransactions = allTransactions.filter(tx => 
    tx.senderName.toLowerCase().includes(txSearchTerm.toLowerCase()) ||
    tx.recipientName.toLowerCase().includes(txSearchTerm.toLowerCase()) ||
    (tx.description && tx.description.toLowerCase().includes(txSearchTerm.toLowerCase()))
  );

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

  return (
    <div className="min-h-screen pb-16">
      <AnimatedBackground />
      
      <div className="container px-4 pt-8">
        <Card>
          <CardHeader>
            <CardTitle>Admin Panel</CardTitle>
            <CardDescription>Manage users and transactions</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="users">
              <TabsList className="mb-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>
              
              {/* Users Tab */}
              <TabsContent value="users">
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{user.name}</div>
                            {user.isAdmin && (
                              <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                Admin
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || '-'}</TableCell>
                          <TableCell>
                            ${user.balance.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs
                              ${user.isVerified 
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}
                            >
                              <span className={`mr-1 rounded-full h-1.5 w-1.5
                                ${user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}
                              />
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Transactions Tab */}
              <TabsContent value="transactions">
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={txSearchTerm}
                    onChange={(e) => setTxSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                          <TableCell>{tx.senderName}</TableCell>
                          <TableCell>{tx.recipientName}</TableCell>
                          <TableCell>
                            ${tx.amount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </TableCell>
                          <TableCell>{tx.description || '-'}</TableCell>
                          <TableCell>{formatDate(tx.timestamp)}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <span className="mr-1 rounded-full h-1.5 w-1.5 bg-green-500" />
                              Completed
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Dashboard Tab */}
              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allUsers.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {allUsers.filter(u => u.isVerified).length} verified users
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{allTransactions.length}</div>
                      <p className="text-xs text-muted-foreground">
                        All time transactions
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${allTransactions
                          .reduce((sum, tx) => sum + tx.amount, 0)
                          .toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        All time transaction volume
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Admin dashboard features would go here */}
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">
                    More detailed analytics and management features would be available in the full version.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
