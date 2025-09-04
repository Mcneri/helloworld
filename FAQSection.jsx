import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection({ faqs = [], title = "Frequently Asked Questions" }) {
  // Ensure faqs is always an array
  const faqList = Array.isArray(faqs) ? faqs : [];

  if (faqList.length === 0) {
    return null;
  }

  const renderAnswer = (answer) => {
    // Check if answer is already a React element/JSX
    if (React.isValidElement(answer) || typeof answer === 'object') {
      return answer;
    }
    
    // If it's a string, process it for HTML and markdown-style formatting
    if (typeof answer === 'string') {
      return (
        <div 
          dangerouslySetInnerHTML={{
            __html: answer
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br/>')
          }}
        />
      );
    }
    
    // Fallback for any other type
    return <div>{String(answer)}</div>;
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-xl text-gray-600">
          Find answers to common questions about our <Link to={createPageUrl("Plans")} className="text-teal-600 hover:text-teal-700 underline">pediatric membership plans</Link> and <Link to={createPageUrl("Services")} className="text-teal-600 hover:text-teal-700 underline">services</Link>.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqList.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-gray-600 text-base prose max-w-none">
              {renderAnswer(faq.answer)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}