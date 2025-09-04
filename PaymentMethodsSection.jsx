import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Banknote, CreditCard } from "lucide-react";

export default function PaymentMethodsSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="bg-white rounded-2xl shadow-lg border p-8 mt-12 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Payment Methods & Policies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Banknote className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bank Transfer</h3>
                <p className="text-gray-600 mb-4">
                    Pay annually via direct bank transfer and save 27% on all plans
                </p>
                <Badge className="bg-green-100 text-green-800">Best Value</Badge>
                </div>
                <div className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Credit Card</h3>
                <p className="text-gray-600 mb-4">
                    Monthly (2-month minimum) or annual payments accepted
                </p>
                <Badge className="bg-teal-100 text-teal-800">Flexible</Badge>
                </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
                <p>* Medical ear piercing re-piercings benefit only applies while membership is maintained</p>
            </div>
            </div>
        </section>
    );
}