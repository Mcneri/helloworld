import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { getStripePubKey } from "@/api/functions";

// Dynamic Stripe loading utility - only loads when needed
let stripePromise = null;
let stripeElementsPromise = null;

const getStripe = async () => {
  if (!stripePromise) {
    // Dynamic import of Stripe - only loads when this function is called
    stripePromise = import("@stripe/stripe-js").then(async (module) => {
      const { data: pubKeyData } = await getStripePubKey();
      return module.loadStripe(pubKeyData.publishableKey);
    });
  }
  return stripePromise;
};

const getStripeElements = async () => {
  if (!stripeElementsPromise) {
    stripeElementsPromise = import("@stripe/react-stripe-js");
  }
  return stripeElementsPromise;
};

export default function StripePaymentForm({ memberData, onPaymentSuccess, onPaymentError }) {
  const [stripeReady, setStripeReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [StripeComponents, setStripeComponents] = useState(null);
  const [stripe, setStripe] = useState(null);

  // Only initialize Stripe after user interaction
  const initializeStripe = async () => {
    if (stripeReady || isLoading) return;
    
    setIsLoading(true);
    try {
      // Load Stripe and React Stripe components in parallel
      const [stripeInstance, stripeElements] = await Promise.all([
        getStripe(),
        getStripeElements()
      ]);
      
      setStripe(stripeInstance);
      setStripeComponents({
        Elements: stripeElements.Elements,
        CardElement: stripeElements.CardElement,
        useStripe: stripeElements.useStripe,
        useElements: stripeElements.useElements
      });
      setStripeReady(true);
    } catch (error) {
      console.error("Failed to initialize Stripe:", error);
      onPaymentError("Failed to load payment system");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user interaction to trigger Stripe loading
  const handleUserInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      initializeStripe();
    }
  };

  // Pre-interaction UI
  if (!userInteracted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Complete Payment?</h3>
          <p className="text-blue-700 mb-4">
            Click below to load our secure payment system and complete your membership registration.
          </p>
          <Button 
            onClick={handleUserInteraction}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
          >
            Load Payment System
            <CreditCard className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading || !stripeReady) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <span className="ml-3 text-gray-600">Loading secure payment system...</span>
      </div>
    );
  }

  // Error state
  if (!stripe || !StripeComponents) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load payment system. Please refresh the page and try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <StripeComponents.Elements stripe={stripe}>
      <PaymentFormContent 
        memberData={memberData}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        StripeComponents={StripeComponents}
      />
    </StripeComponents.Elements>
  );
}

// Separate component to use Stripe hooks
function PaymentFormContent({ memberData, onPaymentSuccess, onPaymentError, StripeComponents }) {
  const [processing, setProcessing] = useState(false);
  
  // This would use the actual Stripe hooks for payment processing
  // Implementation would depend on your specific payment flow
  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    
    // Implement your payment logic here using stripe and elements
    // For now, this is a placeholder
    
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <Lock className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <StripeComponents.CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={processing}
        className="w-full bg-teal-600 hover:bg-teal-700"
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Payment
          </>
        )}
      </Button>
    </form>
  );
}