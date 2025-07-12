import React, { useState, useEffect } from 'react';
import { Check, Star, CreditCard, Shield, Zap, Globe, ArrowRight, X, Crown, Users, Lock, Clock, Download, Share2, Eye, TrendingUp, Gift, CheckCircle, Wallet, Apple, CreditCard as StripeIcon } from 'lucide-react';
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

  const pricingPlans: PricingPlan[] = [
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
      buttonText: "Current Plan",
      buttonVariant: "outline",
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
      buttonText: currentPlan === 'pro' ? "Current Plan" : "Upgrade to Pro",
      buttonVariant: "default",
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
      buttonText: currentPlan === 'business' ? "Current Plan" : "Upgrade to Business",
      buttonVariant: "outline",
      maxFileSize: "50GB",
      transfersPerDay: "Unlimited",
      retentionDays: "90",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600",
      benefits: ["25x larger files", "Team collaboration", "Enterprise security", "API access"],
      limitations: ["Higher cost", "More complex setup"]
    }
  ];

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
      }
      
      toast({
        title: "Upgrade Successful! 🎉",
        description: `Welcome to ${selectedPlan?.name} plan! You can now enjoy all the premium features.`,
      });
      
      // Show success animation
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg upgrade-success z-50';
      successElement.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="font-semibold">Plan upgraded successfully!</span>
        </div>
      `;
      document.body.appendChild(successElement);
      
      // Remove success element after 3 seconds
      setTimeout(() => {
        if (successElement.parentNode) {
          successElement.parentNode.removeChild(successElement);
        }
      }, 3000);
      setShowCheckout(false);
      setSelectedPlan(null);
      
      // Reset form
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
      setCardholderName('');
      setPaymentMethod('card');
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
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
      case 'paypal':
        return <Wallet className="w-5 h-5" />;
      case 'apple':
        return <Apple className="w-5 h-5" />;
      case 'stripe':
        return <StripeIcon className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'paypal':
        return 'PayPal';
      case 'apple':
        return 'Apple Pay';
      case 'stripe':
        return 'Stripe';
      default:
        return 'Credit Card';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-teal-50/30 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Choose the perfect plan for your file sharing needs. Upgrade or downgrade at any time.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Monthly
              </span>
              <Switch
                checked={billingCycle === 'yearly'}
                onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
              />
              <span className={`text-sm ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                Yearly
                <span className="ml-1 text-teal-600 dark:text-teal-400 font-semibold">(Save 20%)</span>
              </span>
            </div>

            {/* Current Plan Display */}
            {isAuthenticated && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getCurrentPlanData()?.color} flex items-center justify-center text-white`}>
                  {getCurrentPlanData()?.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Current Plan: {getCurrentPlanData()?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getCurrentPlanData()?.description}
                  </p>
                </div>
                  </div>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                    Active
                  </Badge>
                </div>
                
                {/* Usage Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{usageStats.filesUploaded}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Files Uploaded</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{usageStats.totalTransfers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Transfers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{usageStats.storageUsed}GB</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Storage Used</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{usageStats.storageLimit}GB</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Storage Limit</div>
                  </div>
                </div>
                
                {/* Storage Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Storage Usage</span>
                    <span>{Math.round((usageStats.storageUsed / usageStats.storageLimit) * 100)}%</span>
                  </div>
                  <Progress value={(usageStats.storageUsed / usageStats.storageLimit) * 100} className="h-2" />
                </div>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={`plan-card relative overflow-hidden ${
                  plan.popular 
                    ? 'border-2 border-teal-500 shadow-2xl scale-105 bg-white/95 dark:bg-gray-800/95' 
                    : plan.id === currentPlan
                    ? 'border-2 border-blue-500 shadow-xl bg-white/90 dark:bg-gray-800/90 current-plan-indicator'
                    : 'border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80'
                } backdrop-blur-xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                {plan.id === currentPlan && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                      <CheckCircle className="w-4 h-4 fill-current" />
                      Current Plan
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pt-8">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mx-auto mb-4`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    variant={plan.buttonVariant}
                    className={`w-full py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg' 
                        : plan.id === currentPlan
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                        : ''
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                    disabled={plan.id === currentPlan}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Plan Comparison Button */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              onClick={() => setShowPlanComparison(true)}
              className="mb-8"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Compare All Plans
            </Button>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All plans include our core security features and 24/7 uptime guarantee.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Need a custom solution? <a href="/contact" className="text-teal-600 hover:text-teal-500 font-medium">Contact our sales team</a>
            </p>
          </div>
        </div>
      </section>

      {showUpgradeBenefits && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-teal-600" />
                  Upgrade to {selectedPlan.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUpgradeBenefits(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"></div>
                    Current Plan ({getCurrentPlanData()?.name})
                  </h4>
                  <ul className="space-y-2">
                    {getCurrentPlanData()?.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <X className="w-3 h-3 text-red-500" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedPlan.color}`}></div>
                    {selectedPlan.name} Plan
                  </h4>
                  <ul className="space-y-2">
                    {selectedPlan.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-3 h-3 text-teal-600" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features You'll Get:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPlan.features.slice(0, 6).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{selectedPlan.name} Plan</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${selectedPlan.price}/{selectedPlan.period}
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                        Save 20% with yearly billing
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowUpgradeBenefits(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpgrade}
                className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Continue to Payment
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {showPlanComparison && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-6xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Plan Comparison
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPlanComparison(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Features</th>
                      {pricingPlans.map((plan) => (
                        <th key={plan.id} className="text-center py-4 px-4 font-semibold text-gray-900 dark:text-white">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mb-2`}>
                              {plan.icon}
                            </div>
                            <div className="text-lg font-bold">{plan.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">${plan.price}/{plan.period}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Max File Size</td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4 text-gray-700 dark:text-gray-300">
                          {plan.maxFileSize}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Transfers Per Day</td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4 text-gray-700 dark:text-gray-300">
                          {plan.transfersPerDay}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">File Retention</td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4 text-gray-700 dark:text-gray-300">
                          {plan.retentionDays} days
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Password Protection</td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.id === 'free' ? (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          ) : (
                            <Check className="w-5 h-5 text-teal-600 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Priority Support</td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.id === 'free' ? (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          ) : (
                            <Check className="w-5 h-5 text-teal-600 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Analytics</td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.id === 'free' ? (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          ) : plan.id === 'pro' ? (
                            <span className="text-sm text-gray-600 dark:text-gray-400">Basic</span>
                          ) : (
                            <span className="text-sm text-teal-600 dark:text-teal-400">Advanced</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">Team Management</td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.id === 'business' ? (
                            <Check className="w-5 h-5 text-teal-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">API Access</td>
                      {pricingPlans.map((plan) => (
                        <td key={plan.id} className="text-center py-4 px-4">
                          {plan.id === 'business' ? (
                            <Check className="w-5 h-5 text-teal-600 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-500 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setShowPlanComparison(false)}
                className="w-full"
              >
                Close Comparison
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Complete Purchase
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCheckout(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan Summary */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedPlan.name} Plan
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  {selectedPlan.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${selectedPlan.price}/{selectedPlan.period}
                  </span>
                  {billingCycle === 'yearly' && (
                    <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                      Save 20%
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                  <div className="space-y-3">
                                      <div className="payment-method-option flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="w-5 h-5" />
                      Credit Card
                    </Label>
                  </div>
                  <div className="payment-method-option flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                      <Wallet className="w-5 h-5 text-blue-600" />
                      PayPal
                    </Label>
                  </div>
                  <div className="payment-method-option flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <RadioGroupItem value="apple" id="apple" />
                    <Label htmlFor="apple" className="flex items-center gap-2 cursor-pointer">
                      <Apple className="w-5 h-5" />
                      Apple Pay
                    </Label>
                  </div>
                  <div className="payment-method-option flex items-center space-x-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                      <StripeIcon className="w-5 h-5 text-purple-600" />
                      Stripe
                    </Label>
                  </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment Form - Only show for card payment */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardholder">Cardholder Name</Label>
                    <Input
                      id="cardholder"
                      placeholder="John Doe"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="card">Card Number</Label>
                    <Input
                      id="card"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Alternative Payment Methods */}
              {paymentMethod !== 'card' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    {getPaymentMethodIcon(paymentMethod)}
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {getPaymentMethodName(paymentMethod)}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You'll be redirected to {getPaymentMethodName(paymentMethod)} to complete your payment securely.
                  </p>
                </div>
              )}

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Your payment is secured with SSL encryption</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 ${isProcessing ? 'payment-loading' : ''}`}
              >
                {isProcessing ? 'Processing...' : `Pay $${selectedPlan.price} with ${getPaymentMethodName(paymentMethod)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

    </div>
  );
};

export default Pricing; 