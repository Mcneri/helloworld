import React, { memo } from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, ArrowRight } from "lucide-react";

// PERF: Moved static plans data outside component to prevent recreation on each render
const plans = [
  {
    name: "Bronze",
    subtitle: "Essential Care",
    monthlyPrice: 250,
    annualPrice: 2190,
    savings: 810,
    color: "from-amber-400 to-orange-500",
    features: ["Unlimited wellness visits", "Concern visits", "ADHD visits", "Forms & referrals"]
  },
  {
    name: "Silver",
    subtitle: "Enhanced Care",
    monthlyPrice: 400,
    annualPrice: 3504,
    savings: 1296,
    color: "from-slate-400 to-gray-500",
    popular: true,
    features: ["Everything in Bronze", "Telemedicine visits", "Rapid tests", "Ear piercings"]
  },
  {
    name: "Gold",
    subtitle: "Premium Care",
    monthlyPrice: 500,
    annualPrice: 4380,
    savings: 1620,
    color: "from-yellow-400 to-amber-500",
    features: ["Everything in Silver", "All vaccines", "Circumcision", "Direct messaging", "Priority scheduling"]
  }
];

// PERF: Memoized plan card component
const PlanCard = memo(({ plan, index }) => (
  <Card className={`card-hover relative border-gray-200 shadow-lg bg-white animate-fade-in-up animation-delay-${(index + 1) * 200} ${plan.popular ? 'ring-2 ring-teal-500' : ''}`}>
    {plan.popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="badge-popular px-4 py-2 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      </div>
    )}
    <CardContent className="p-8">
      <div className="text-center mb-6">
        <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110`}>
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
        <p className="text-gray-600">{plan.subtitle}</p>
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-800">${plan.monthlyPrice}</div>
        <div className="text-gray-600">per month</div>
        <div className="mt-2 p-3 bg-green-100 rounded-lg">
          <div className="text-lg font-bold text-green-800">${plan.annualPrice}/year</div>
          <div className="text-sm text-green-700">Save ${plan.savings} annually</div>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
));

PlanCard.displayName = 'PlanCard';

// PERF: Memoized main component
const PricingPreviewSection = memo(() => {
  return (
    <section className="bg-white py-20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in">
            Atlanta's Most Comprehensive <Link to={createPageUrl("Services")} className="text-link">Concierge Pediatrics Plans</Link>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in animation-delay-200">
            Choose the perfect <Link to={createPageUrl("Plans")} className="text-link">direct pay membership pediatrics plan</Link> for your family's needs. All plans include <Link to={createPageUrl("Services")} className="text-link">unlimited wellness visits</Link> and multi-child discounts - the hallmark of quality <Link to={createPageUrl("Services")} className="text-link">DPC pediatrics</Link>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={createPageUrl("Plans")}>
            <Button size="lg" className="btn-enhanced bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg">
              Compare All Plans
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
});

PricingPreviewSection.displayName = 'PricingPreviewSection';

export default PricingPreviewSection;