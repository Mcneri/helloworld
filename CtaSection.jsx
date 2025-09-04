import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight, Phone, MessageCircle } from "lucide-react";

export default function CtaSection() {
    return (
        <section className="relative bg-gradient-to-r from-teal-600 via-purple-600 to-cyan-600 mt-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-300/20 rounded-full animate-bounce"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-orange-300/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-300/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-blue-300/20 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4 animate-pulse">
                <Heart className="w-10 h-10 text-pink-200" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in">
              Ready to Join Our <span className="text-yellow-300">Family</span>?
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-200">
              Start your membership today and give your children the comprehensive care they deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to={createPageUrl("Join")}>
                <Button size="lg" className="btn-enhanced bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-10 py-6 text-xl shadow-2xl">
                  Join Now
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <div className="flex flex-col sm:flex-row items-center gap-6 text-teal-100">
                <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">470-485-6342</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold">info@omegapediatrics.com</span>
                </div>
              </div>
            </div>
            
            {/* Added sparkle effect */}
            <div className="mt-8 flex justify-center" aria-hidden="true">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-pink-300 rounded-full animate-ping delay-100"></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-ping delay-200"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}