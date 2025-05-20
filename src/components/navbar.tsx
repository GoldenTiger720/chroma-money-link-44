
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Wallet, History } from "lucide-react";
import { ModeToggle } from './mode-toggle';
import { WalletConnector } from './wallet-connector';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/hooks/use-auth';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the home page
    if (location.pathname !== '/') {
      // If not, navigate to home with the section hash
      return `/#${sectionId}`;
    } else {
      // If already on home page, just use the hash for smooth scrolling
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      return `#${sectionId}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2" onClick={scrollToTop}>
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
              <Wallet className="h-5 w-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">ChromaPay</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium hover:text-primary transition-colors" 
            onClick={scrollToTop}
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/wallet" className="text-sm font-medium hover:text-primary transition-colors">Wallet</Link>
              <Link to="/transfer" className="text-sm font-medium hover:text-primary transition-colors">Transfer</Link>
              <Link to="/history" className="text-sm font-medium hover:text-primary transition-colors">History</Link>
            </>
          ) : (
            <>
              <Link 
                to={scrollToSection('features')} 
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    const featuresElement = document.getElementById('features');
                    if (featuresElement) {
                      featuresElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link 
                to={scrollToSection('about')} 
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    const aboutElement = document.getElementById('about');
                    if (aboutElement) {
                      aboutElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                About
              </Link>
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          <WalletConnector />
          
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/wallet">Wallet</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/history">
                        <History className="mr-2 h-4 w-4" />
                        <span>Transaction History</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
