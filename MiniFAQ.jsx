import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, ExternalLink } from "lucide-react";

export default function MiniFAQ({ faqs = [], title = "Common Questions" }) {
  const faqList = Array.isArray(faqs) ? faqs.slice(0, 5) : []; // Show first 5

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-2xl shadow-lg border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-teal-600"/>
          {title}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqList.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left font-medium text-gray-800">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 prose prose-sm max-w-none">
                {renderAnswer(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-8 text-center">
          <Link to={createPageUrl("FAQ")}>
            <Button variant="outline">
              See All <Link to={createPageUrl("FAQ")} className="text-gray-900 hover:text-teal-700">FAQs</Link>
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}