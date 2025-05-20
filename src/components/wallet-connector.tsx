
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, Bitcoin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type WalletType = "metamask" | "phantom" | "walletconnect" | null;

export function WalletConnector() {
  const [connecting, setConnecting] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<WalletType>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connectToMetaMask = async () => {
    setConnecting(true);
    
    try {
      // Check if MetaMask is installed
      if (window.ethereum && window.ethereum.isMetaMask) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setConnectedWallet("metamask");
          
          toast({
            title: "Wallet Connected",
            description: `MetaMask connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
        }
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask extension to connect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const connectToPhantom = async () => {
    setConnecting(true);
    
    try {
      // Check if Phantom is installed
      if (window.solana && window.solana.isPhantom) {
        // Request connection
        const response = await window.solana.connect();
        const address = response.publicKey.toString();
        
        setWalletAddress(address);
        setConnectedWallet("phantom");
        
        toast({
          title: "Wallet Connected",
          description: `Phantom connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } else {
        toast({
          title: "Phantom Not Found",
          description: "Please install Phantom extension to connect",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting to Phantom:", error);
      toast({
        title: "Connection Failed", 
        description: "Failed to connect to Phantom",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const connectWalletConnect = async () => {
    setConnecting(true);
    
    try {
      // Simulate connecting with WalletConnect
      setTimeout(() => {
        const mockAddress = "0x" + [...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
        setWalletAddress(mockAddress);
        setConnectedWallet("walletconnect");
        
        toast({
          title: "Wallet Connected",
          description: `WalletConnect connected: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        });
        setConnecting(false);
      }, 1000);
    } catch (error) {
      console.error("Error connecting with WalletConnect:", error);
      setConnecting(false);
      toast({
        title: "Connection Failed",
        description: "Failed to connect with WalletConnect",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    setWalletAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  if (connectedWallet) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="ml-2 text-xs"
        onClick={disconnectWallet}
      >
        <Wallet className="h-4 w-4 mr-1" />
        {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full"
          disabled={connecting}
        >
          <Bitcoin className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Connect Wallet</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={connectToMetaMask}>
          <img 
            src="https://cdn.jsdelivr.net/gh/MetaMask/brand-resources@master/SVG/metamask-fox.svg" 
            alt="MetaMask" 
            className="h-4 w-4 mr-2"
          />
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem onClick={connectToPhantom}>
          <img 
            src="https://www.phantom.app/img/phantom-logo.svg" 
            alt="Phantom" 
            className="h-4 w-4 mr-2"
          />
          Phantom
        </DropdownMenuItem>
        <DropdownMenuItem onClick={connectWalletConnect}>
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm0kemTbBswK3dcYrrPT_YQK3c0JWveGHWdA&usqp=CAU" 
            alt="WalletConnect" 
            className="h-4 w-4 mr-2"
          />
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
