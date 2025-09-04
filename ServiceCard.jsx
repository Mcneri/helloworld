import React, { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Info } from "lucide-react";

// PERF: Memoized ServiceCard component to prevent unnecessary re-renders
// This component will only re-render if the service prop actually changes
const ServiceCard = memo(({ service }) => {
  return (
    <Card className={`card-hover border-gray-200 shadow-lg bg-white animate-fade-in-up ${service.popular ? 'ring-2 ring-teal-500' : ''}`}>
      {service.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-4 py-1">
            Popular
          </Badge>
        </div>
      )}
      <CardContent className="p-6">
        <div className="mb-4">
          <h4 className="text-xl font-semibold text-gray-800 mb-2">{service.name}</h4>
          <p className="text-gray-600">{service.description}</p>
          {service.tier_specific && (
            <div className="mt-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              <p className="text-sm text-blue-700 italic">{service.tier_specific}</p>
            </div>
          )}
          {service.annual_only && (
            <div className="mt-2">
              <Badge variant="outline" className="text-orange-700 border-orange-300">
                Annual Members Only
              </Badge>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Bronze Plan</span>
            {service.bronze_included ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Silver Plan</span>
            {service.silver_included ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Gold Plan</span>
            {service.gold_included ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>

          {service.regular_price > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Without membership:</span>
                <span className="text-lg font-semibold text-red-600">${service.regular_price}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;