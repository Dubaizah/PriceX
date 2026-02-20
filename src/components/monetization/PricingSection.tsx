"use client";

import { useState } from "react";
import { Check, Star, Zap, Shield, Crown } from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Basic price tracking for casual shoppers",
    icon: <Star className="w-5 h-5" />,
    features: [
      "Price comparisons for 1,000 products",
      "5 price alerts",
      "Basic deal scores",
      "Web access only",
      "English language",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    period: "month",
    description: "For serious savvers who want the best deals",
    highlighted: true,
    icon: <Zap className="w-5 h-5" />,
    features: [
      "Unlimited product comparisons",
      "Unlimited price alerts",
      "Advanced deal scores with AI predictions",
      "Price history charts (365 days)",
      "Cashback rewards activation",
      "Voice search",
      "All 12 languages",
      "Ad-free experience",
      "Priority customer support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19.99,
    period: "month",
    description: "For power users and small businesses",
    icon: <Shield className="w-5 h-5" />,
    features: [
      "Everything in Premium",
      "API access (1,000 calls/month)",
      "Custom price dashboards",
      "Export data to CSV/Excel",
      "Bulk product tracking",
      "Team collaboration (up to 5)",
      "Custom alerts (SMS, WhatsApp)",
      "White-label reports",
      "Dedicated account manager",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.99,
    period: "month",
    description: "For large organizations with advanced needs",
    icon: <Crown className="w-5 h-5" />,
    features: [
      "Everything in Pro",
      "Unlimited API access",
      "Custom integrations",
      "Real-time data feeds",
      "Advanced analytics",
      "Dedicated infrastructure",
      "Custom SLA",
      "On-premise deployment option",
      "Volume discounts",
    ],
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const yearlyDiscount = 20;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your <span className="text-[#FFD700]">PriceX</span> Plan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Unlock the full power of AI-powered price comparisons. Start saving today.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-[#FFD700] transition-colors"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  billingCycle === "yearly" ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === "yearly" ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500"}`}>
              Yearly
            </span>
            {billingCycle === "yearly" && (
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Save {yearlyDiscount}%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 transition-all hover:shadow-xl ${
                plan.highlighted
                  ? "bg-gradient-to-b from-[#FFD700] to-yellow-600 text-white transform scale-105 shadow-2xl"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-[#FFD700] px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`flex items-center gap-2 mb-4 ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {plan.icon}
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>
              
              <div className="mb-4">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                  ${billingCycle === "yearly" && plan.price > 0 
                    ? (plan.price * 12 * (1 - yearlyDiscount / 100) / 12).toFixed(2)
                    : plan.price}
                </span>
                {plan.price > 0 && (
                  <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-gray-500"}`}>
                    /{billingCycle === "yearly" ? "month (billed annually)" : "month"}
                  </span>
                )}
              </div>
              
              <p className={`text-sm mb-6 ${plan.highlighted ? "text-white/80" : "text-gray-500"}`}>
                {plan.description}
              </p>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? "text-white" : "text-[#FFD700]"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-white/90" : "text-gray-600 dark:text-gray-300"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-black text-[#FFD700] hover:bg-gray-900"
                    : "bg-[#FFD700] text-black hover:bg-yellow-400"
                }`}
              >
                {plan.price === 0 ? "Get Started" : "Subscribe Now"}
              </button>
            </div>
          ))}
        </div>
        
        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>30-day money back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>Cancel anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            <span>10M+ users trust PriceX</span>
          </div>
        </div>
      </div>
    </section>
  );
}
