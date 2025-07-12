import React, { useState, useEffect } from 'react';
import { Check, Star, CreditCard, Shield, Zap, Globe, ArrowRight, X, Crown, Users, Lock, Clock, Download, Share2, Eye, TrendingUp, Gift, CheckCircle, Wallet, Apple, CreditCard as StripeIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  maxFileSize: string;
  transfersPerDay: string;
  retentionDays: string;
  icon: React.ReactNode;
  color: string;
  benefits: string[];
  limitations: string[];
}

type PaymentMethod = 'card' | 'paypal' | 'apple' | 'stripe';

const Pricing = () => {
  const { isAuthenticated, user, updateUserPlan, getCurrentPlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPlanComparison, setShowPlanComparison] = useState(false);
  const [showUpgradeBenefits, setShowUpgradeBenefits] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [usageStats, setUsageStats] = useState({
    filesUploaded: 3,
    totalTransfers: 12,
    storageUsed: 1.2, // GB
    storageLimit: 2, // GB
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    const plan = getCurrentPlan();
    setCurrentPlan(plan);
  }, [user, getCurrentPlan]);

  // Update current plan when it changes
  useEffect(() => {
    const plan = getCurrentPlan();
    setCurrentPlan(plan);
  }, [getCurrentPlan]);

  const getPricingPlans = (): PricingPlan[] => {
    const currentPlanId = getCurrentPlan();
    
    return [
      {
        id: 'free',
        name: "Free",
        price: 0,
        period: "month",
        description: "Perfect for personal use and small file sharing needs",
        features: [
          "Up to 2GB file size",
          "5 transfers per day",
          "7-day file retention",
          "Basic encryption",
          "Standard support"
        ],
        popular: false,
        buttonText: currentPlanId === 'free' ? "Current Plan" : "Downgrade",
        buttonVariant: currentPlanId === 'free' ? "outline" : "outline",
        maxFileSize: "2GB",
        transfersPerDay: "5",
        retentionDays: "7",
        icon: <Zap className="w-6 h-6" />,
        color: "from-gray-400 to-gray-600",
        benefits: ["No credit card required", "Instant access", "Basic features"],
        limitations: ["Limited file size", "Daily transfer limits", "Short retention"]
      },
      {
        id: 'pro',
        name: "Pro",
        price: billingCycle === 'yearly' ? 90 : 9,
        period: billingCycle === 'yearly' ? 'year' : 'month',
        description: "Ideal for professionals and small teams",
        features: [
          "Up to 10GB file size",
          "Unlimited transfers",
          "30-day file retention",
          "Advanced encryption",
          "Priority support",
          "Custom branding",
          "Password protection",
          "Download analytics"
        ],
        popular: true,
        buttonText: currentPlanId === 'pro' ? "Current Plan" : "Upgrade to Pro",
        buttonVariant: currentPlanId === 'pro' ? "outline" : "default",
        maxFileSize: "10GB",
        transfersPerDay: "Unlimited",
        retentionDays: "30",
        icon: <Crown className="w-6 h-6" />,
        color: "from-teal-500 to-blue-600",
        benefits: ["5x larger files", "Unlimited transfers", "Advanced security", "Priority support"],
        limitations: ["No team features", "Limited analytics"]
      },
      {
        id: 'business',
        name: "Business",
        price: billingCycle === 'yearly' ? 290 : 29,
        period: billingCycle === 'yearly' ? 'year' : 'month',
        description: "For businesses and large teams with advanced needs",
        features: [
          "Up to 50GB file size",
          "Unlimited transfers",
          "90-day file retention",
          "Enterprise encryption",
          "24/7 priority support",
          "Full white-label",
          "Advanced analytics",
          "Team management",
          "API access",
          "Custom integrations"
        ],
        popular: false,
        buttonText: currentPlanId === 'business' ? "Current Plan" : "Upgrade to Business",
        buttonVariant: currentPlanId === 'business' ? "outline" : "outline",
        maxFileSize: "50GB",
        transfersPerDay: "Unlimited",
        retentionDays: "90",
        icon: <Users className="w-6 h-6" />,
        color: "from-purple-500 to-pink-600",
        benefits: ["25x larger files", "Team collaboration", "Enterprise security", "API access"],
        limitations: ["Higher cost", "More complex setup"]
      }
    ];
  };

  const pricingPlans = getPricingPlans();

  const handlePlanSelect = (plan: PricingPlan) => {
    if (plan.id === currentPlan) {
      toast({
        title: "Current Plan",
        description: "You're already on this plan!",
      });
      return;
    }

    if (plan.id === 'free') {
      // Downgrade logic
      toast({
        title: "Plan Downgrade",
        description: "Contact support to downgrade your plan.",
      });
      return;
    }

    setSelectedPlan(plan);
    setShowUpgradeBenefits(true);
  };

  const handleUpgrade = () => {
    setShowUpgradeBenefits(false);
    setShowCheckout(true);
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card' && (!email || !cardNumber || !expiryDate || !cvv || !cardholderName)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all payment details.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Update the user's plan
      if (selectedPlan) {
        updateUserPlan(selectedPlan.id);
        setCurrentPlan(selectedPlan.id);
        
        // Force re-render of pricing plans
        const updatedPlans = getPricingPlans();
        
        toast({
          title: "Upgrade Successful! 🎉",
          description: `You've been upgraded to ${selectedPlan.name} plan. Enjoy your new features!`,
        });
        
        setShowCheckout(false);
        setSelectedPlan(null);
        
        // Reset form
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardholderName('');
        setPaymentMethod('card');
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCurrentPlanData = () => pricingPlans.find(plan => plan.id === currentPlan);

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'paypal': return <Wallet className="w-4 h-4" />;
      case 'apple': return <Apple className="w-4 h-4" />;
      case 'stripe': return <StripeIcon className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'card': return 'Credit Card';
      case 'paypal': return 'PayPal';
      case 'apple': return 'Apple Pay';
      case 'stripe': return 'Stripe';
      default: return 'Credit Card';
    }
  };

  const currentPlanData = getCurrentPlanData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select the perfect plan for your file sharing needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Current Plan Display */}
        {isAuthenticated && currentPlanData && (
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${currentPlanData.color} rounded-lg flex items-center justify-center`}>
                      {currentPlanData.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Current Plan: {currentPlanData.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentPlanData.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-300">
                      Active
                    </Badge>
                    {user?.planExpiry && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Expires: {new Date(user.planExpiry).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Current Plan Benefits */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Your Current Benefits:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentPlanData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-500" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-teal-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Yearly
                <Badge className="ml-2 bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 text-xs">
                  Save 20%
                </Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-teal-500 shadow-xl' : 'hover:shadow-lg'
              } ${plan.id === currentPlan ? 'bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20' : ''}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-center py-2 text-sm font-medium">
                  <Star className="w-4 h-4 inline mr-1" />
                  Most Popular
                </div>
              )}
              
              {plan.id === currentPlan && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                  Current Plan
                </div>
              )}

              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.buttonVariant === 'default' 
                      ? 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700' 
                      : ''
                  }`}
                  disabled={plan.id === currentPlan}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Plan Comparison */}
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => setShowPlanComparison(!showPlanComparison)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {showPlanComparison ? 'Hide' : 'Show'} Plan Comparison
          </Button>
        </div>

        {showPlanComparison && (
          <Card className="max-w-4xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-center">Plan Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Feature</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Free</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Pro</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Max File Size</td>
                      <td className="text-center py-3 px-4">2GB</td>
                      <td className="text-center py-3 px-4">10GB</td>
                      <td className="text-center py-3 px-4">50GB</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Transfers per Day</td>
                      <td className="text-center py-3 px-4">5</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                      <td className="text-center py-3 px-4">Unlimited</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">File Retention</td>
                      <td className="text-center py-3 px-4">7 days</td>
                      <td className="text-center py-3 px-4">30 days</td>
                      <td className="text-center py-3 px-4">90 days</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Support</td>
                      <td className="text-center py-3 px-4">Standard</td>
                      <td className="text-center py-3 px-4">Priority</td>
                      <td className="text-center py-3 px-4">24/7 Priority</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Analytics</td>
                      <td className="text-center py-3 px-4">Basic</td>
                      <td className="text-center py-3 px-4">Advanced</td>
                      <td className="text-center py-3 px-4">Enterprise</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Benefits Modal */}
        {showUpgradeBenefits && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-6 h-6 text-teal-600" />
                  Upgrade to {selectedPlan.name}
                </CardTitle>
                <CardDescription>
                  Here's what you'll get with your upgrade:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">New Benefits:</h4>
                    <div className="space-y-2">
                      {selectedPlan.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Plan Features:</h4>
                    <div className="space-y-2">
                      {selectedPlan.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Check className="w-4 h-4 text-teal-500" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedPlan.name} Plan
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${selectedPlan.price}/{selectedPlan.period}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${selectedPlan.price}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        per {selectedPlan.period}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowUpgradeBenefits(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpgrade}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                >
                  Continue to Payment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckout && selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Complete Your Purchase</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCheckout(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  Upgrade to {selectedPlan.name} plan for ${selectedPlan.price}/{selectedPlan.period}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className="grid grid-cols-2 gap-4 mt-2"
                  >
                    <div>
                      <RadioGroupItem value="card" id="card" className="peer sr-only" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-teal-500 peer-checked:bg-teal-50 dark:peer-checked:bg-teal-900/20"
                      >
                        <CreditCard className="w-4 h-4" />
                        Credit Card
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                      <Label
                        htmlFor="paypal"
                        className="flex items-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-teal-500 peer-checked:bg-teal-50 dark:peer-checked:bg-teal-900/20"
                      >
                        <Wallet className="w-4 h-4" />
                        PayPal
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="apple" id="apple" className="peer sr-only" />
                      <Label
                        htmlFor="apple"
                        className="flex items-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-teal-500 peer-checked:bg-teal-50 dark:peer-checked:bg-teal-900/20"
                      >
                        <Apple className="w-4 h-4" />
                        Apple Pay
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="stripe" id="stripe" className="peer sr-only" />
                      <Label
                        htmlFor="stripe"
                        className="flex items-center gap-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer peer-checked:border-teal-500 peer-checked:bg-teal-50 dark:peer-checked:bg-teal-900/20"
                      >
                        <StripeIcon className="w-4 h-4" />
                        Stripe
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardholder">Cardholder Name</Label>
                      <Input
                        id="cardholder"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={4}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{selectedPlan.name} Plan</span>
                      <span className="font-medium">${selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Billing Cycle</span>
                      <span className="font-medium capitalize">{billingCycle}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${selectedPlan.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ${selectedPlan.price}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing; 