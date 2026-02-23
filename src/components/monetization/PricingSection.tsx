"use client";

import { useState } from "react";
import { Check, Star, Zap, Shield, Crown } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";

interface PricingPlan {
  id: string;
  nameKey: string;
  price: number;
  periodKey: string;
  descriptionKey: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    nameKey: "pricing.free.name",
    price: 0,
    periodKey: "pricing.free.period",
    descriptionKey: "pricing.free.description",
    icon: <Star className="w-5 h-5" />,
    features: [
      "pricing.free.feature1",
      "pricing.free.feature2",
      "pricing.free.feature3",
      "pricing.free.feature4",
      "pricing.free.feature5",
    ],
  },
  {
    id: "premium",
    nameKey: "pricing.premium.name",
    price: 9.99,
    periodKey: "pricing.premium.period",
    descriptionKey: "pricing.premium.description",
    highlighted: true,
    icon: <Zap className="w-5 h-5" />,
    features: [
      "pricing.premium.feature1",
      "pricing.premium.feature2",
      "pricing.premium.feature3",
      "pricing.premium.feature4",
      "pricing.premium.feature5",
      "pricing.premium.feature6",
      "pricing.premium.feature7",
      "pricing.premium.feature8",
      "pricing.premium.feature9",
    ],
  },
  {
    id: "pro",
    nameKey: "pricing.pro.name",
    price: 19.99,
    periodKey: "pricing.pro.period",
    descriptionKey: "pricing.pro.description",
    icon: <Shield className="w-5 h-5" />,
    features: [
      "pricing.pro.feature1",
      "pricing.pro.feature2",
      "pricing.pro.feature3",
      "pricing.pro.feature4",
      "pricing.pro.feature5",
      "pricing.pro.feature6",
      "pricing.pro.feature7",
      "pricing.pro.feature8",
      "pricing.pro.feature9",
    ],
  },
  {
    id: "enterprise",
    nameKey: "pricing.enterprise.name",
    price: 99.99,
    periodKey: "pricing.enterprise.period",
    descriptionKey: "pricing.enterprise.description",
    icon: <Crown className="w-5 h-5" />,
    features: [
      "pricing.enterprise.feature1",
      "pricing.enterprise.feature2",
      "pricing.enterprise.feature3",
      "pricing.enterprise.feature4",
      "pricing.enterprise.feature5",
      "pricing.enterprise.feature6",
      "pricing.enterprise.feature7",
      "pricing.enterprise.feature8",
      "pricing.enterprise.feature9",
    ],
  },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const yearlyDiscount = 20;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-[#FFD700]">{t('app.name')}</span> {t('pricing.plan')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {t('home.pricing.subtitle')}
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-gray-900 dark:text-white font-semibold" : "text-gray-500"}`}>
              {t('pricing.monthly', 'Monthly')}
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
              {t('pricing.yearly', 'Yearly')}
            </span>
            {billingCycle === "yearly" && (
              <span className="ml-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                {t('pricing.save', 'Save')} {yearlyDiscount}%
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
                    {t('pricing.mostPopular', 'Most Popular')}
                  </span>
                </div>
              )}
              
              <div className={`flex items-center gap-2 mb-4 ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                {plan.icon}
                <h3 className="text-xl font-bold">{t(plan.nameKey, plan.nameKey)}</h3>
              </div>
              
              <div className="mb-4">
                <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                  {billingCycle === "yearly" && plan.price > 0 
                    ? formatPrice(plan.price * 12 * (1 - yearlyDiscount / 100) / 12)
                    : formatPrice(plan.price)}
                </span>
                {plan.price > 0 && (
                  <span className={`text-sm ${plan.highlighted ? "text-white/80" : "text-gray-500"}`}>
                    /{billingCycle === "yearly" ? t('pricing.billedAnnually', 'month (billed annually)') : t('pricing.perMonth', 'month')}
                  </span>
                )}
              </div>
              
              <p className={`text-sm mb-6 ${plan.highlighted ? "text-white/80" : "text-gray-500"}`}>
                {t(plan.descriptionKey, plan.descriptionKey)}
              </p>
              
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? "text-white" : "text-[#FFD700]"}`} />
                    <span className={`text-sm ${plan.highlighted ? "text-white/90" : "text-gray-600 dark:text-gray-300"}`}>
                      {t(feature, feature)}
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
                {plan.price === 0 ? t('pricing.getStarted', 'Get Started') : t('pricing.subscribe', 'Subscribe Now')}
              </button>
            </div>
          ))}
        </div>
        
        {/* Trust Badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span>{t('pricing.moneyBack', '30-day money back guarantee')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span>{t('pricing.cancel', 'Cancel anytime')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            <span>{t('pricing.usersTrust', '10M+ users trust PriceX')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
