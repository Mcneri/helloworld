import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function ServicesCtaSection() {
    return (
        <div className="mt-16 text-center animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready for Exceptional <Link to={createPageUrl("Services")} className="text-link">Care</Link>?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose a <Link to={createPageUrl("Plans")} className="text-link">plan</Link> that fits your family's needs and enjoy the benefits of our premier <Link to={createPageUrl("Plans")} className="text-link">DPC pediatrics membership</Link>.
          </p>
          <Link to={createPageUrl("Plans")}>
            <Button size="lg" className="btn-enhanced bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 text-lg">
              View Plans & Pricing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
    );
}