"use client";

import { useState } from "react";
import { B2B_TIERS, B2BSubscriptionTier } from "@/lib/monetization/config";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";

export function B2BPricingTable() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          B2B Data API Pricing
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Access real-time pricing data, market intelligence, and AI predictions
          for your business
        </p>

        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingCycle === "monthly"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              billingCycle === "annual"
                ? "bg-yellow-400 text-black"
                : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            Annual
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">
              Save up to 30%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {B2B_TIERS.map((tier) => (
          <PricingCard
            key={tier.id}
            tier={tier}
            billingCycle={billingCycle}
            isPopular={tier.id === "growth"}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          All plans include API documentation, SDKs, and example code.{' '}
          <a href="/docs/api" className="text-yellow-600 hover:text-yellow-700 underline">
            View API documentation
          </a>
        </p>
      </div>
    </div>
  );
}

function PricingCard({
  tier,
  billingCycle,
  isPopular,
}: {
  tier: B2BSubscriptionTier;
  billingCycle: "monthly" | "annual";
  isPopular: boolean;
}) {
  const price =
    billingCycle === "annual"
      ? tier.monthlyPrice * (1 - tier.annualDiscount / 100) * 12
      : tier.monthlyPrice;

  return (
    <div
      className={`relative rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
        isPopular
          ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
          : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {tier.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {tier.targetMarket}
        </p>
      </div>

      <div className="text-center mb-6">
        {tier.id === "custom" ? (
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact Us
          </div>
        ) : (
          <>
            <div className="text-4xl font-bold text-gray-900 dark:text-white">
              ${Math.round(price)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              /{billingCycle === "annual" ? "year" : "month"}
            </div>
          </>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        <FeatureItem text={`${tier.features.apiCalls.toLocaleString()} API calls/month`} />
        <FeatureItem text={`${tier.features.historicalDataDays} days historical data`} />
        {tier.features.realTimeUpdates && (
          <FeatureItem text="Real-time price updates" />
        )}
        {tier.features.webhookSupport && (
          <FeatureItem text="Webhook notifications" />
        )}
        {tier.features.dedicatedSupport && (
          <FeatureItem text="Dedicated account manager" />
        )}
        {tier.features.customReports && (
          <FeatureItem text="Custom reports & analytics" />
        )}
        <FeatureItem text={`${tier.features.sla} SLA guarantee`} />
      </ul>

      <Button
        variant={isPopular ? "primary" : "outline"}
        className="w-full"
        onClick={() => {
          // Handle subscription
          console.log(`Subscribe to ${tier.name}`);
        }}
      >
        {tier.id === "custom" ? "Contact Sales" : "Get Started"}
      </Button>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2">
      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
      <span className="text-gray-700 dark:text-gray-300 text-sm">{text}</span>
    </li>
  );
}
