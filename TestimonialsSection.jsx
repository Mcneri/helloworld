import React, { memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

// PERF: Moved static testimonials outside component to prevent recreation
const testimonials = [
    {
      name: "Jessica M.",
      role: "Parent from Roswell",
      content: "This is the best first decision any parent can make for their child. The concierge pediatrics model with 24/7 access and unlimited visits have given us incredible peace of mind during these crucial first months.",
      rating: 5
    },
    {
      name: "David L.",
      role: "Father from Alpharetta",
      content: "When my son had a high fever at 2 AM, I didn't have to guess or go to an ER. A quick call to Omega and we had a plan. That level of access is priceless with their DPC pediatrics approach. The annual plan has already paid for itself.",
      rating: 5
    },
    {
      name: "Emily R.",
      role: "Mother from Sandy Springs",
      content: "Omega Pediatrics is more than a clinic; it's a partner in our children's health. The doctors know my kids by name, and the concierge care is always compassionate and thorough. Worth every penny.",
      rating: 5
    }
  ];

// PERF: Memoized testimonial card component
const TestimonialCard = memo(({ testimonial, index }) => (
  <Card className={`card-hover border-0 shadow-lg animate-fade-in-up animation-delay-${(index + 1) * 200}`}>
    <CardContent className="p-8">
      <div className="flex items-center gap-1 mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <blockquote className="text-gray-700 mb-6 italic">
        "{testimonial.content}"
      </blockquote>
      <div>
        <div className="font-semibold text-gray-900">{testimonial.name}</div>
        <div className="text-gray-600">{testimonial.role}</div>
      </div>
    </CardContent>
  </Card>
));

TestimonialCard.displayName = 'TestimonialCard';

// PERF: Memoized main component
const TestimonialsSection = memo(() => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
          What Families Are Saying
        </h2>
        <p className="text-xl text-gray-600 animate-fade-in animation-delay-200">
          Real stories from families who've chosen Omega Pediatrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
        ))}
      </div>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';

export default TestimonialsSection;