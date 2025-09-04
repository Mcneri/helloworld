
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Shield,
  Heart,
  CreditCard,
  Users,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  ExternalLink
} from "lucide-react";

const faqCategories = [
  {
    id: "general",
    title: "General Information",
    letter: "O",
    icon: HelpCircle,
    color: "from-red-500 to-red-600",
    bgGlow: "bg-red-100",
    questions: [
      {
        question: "What is Omega Premium Care?",
        answer: "Omega Premium Care, also known as [[Omega Pediatrics Premium Membership Care|Home]], offers comprehensive pediatric care through exclusive membership plans. Our goal is to provide peace of mind and exceptional value for families through a unique [[direct primary care model|Services]].",
        link: "https://members.omegapediatrics.com/Home"
      },
      {
        question: "What makes Omega Pediatrics Premium Membership Care unique?",
        answer: "We stand apart by offering unlimited wellness visits, priority scheduling, and family-focused comprehensive care designed specifically for modern families. Our [[membership model|Plans]] aims to simplify pediatric care and provide significant savings compared to traditional healthcare.",
        link: "https://members.omegapediatrics.com/Home"
      },
      {
        question: "Are memberships at Omega Premium Care limited?",
        answer: "Yes, to maintain our high standard of personalized care and service quality, our [[memberships are limited|Plans]]. A waiting list may apply for new enrollments to ensure every family receives the attention they deserve."
      },
      {
        question: "Do you offer services in languages other than English?",
        answer: "Yes, we are proud to offer [[bilingual care|Services]]. Our staff and providers, including Dr. Michael Nwaneri, ensure clear communication and culturally sensitive care in both English and Spanish."
      },
      {
        question: "What are your standard operating hours?",
        answer: "Our clinics are open from 11 am to 9 pm on weekdays. For urgent non-emergency medical concerns, our phone lines are open 24/7."
      },
      {
        question: "How can I contact Omega Pediatrics Premium Membership Care?",
        answer: "You can reach us directly by phone at 470-485-6342 or send an email to info@omegapediatrics.com."
      },
      {
        question: "Where are your clinic locations?",
        answer: "We have convenient locations in: **Roswell:** 1305 Hembree Road STE 203, Roswell GA 30076 | **Marietta:** 1841 Piedmont Road NE, STE 100, Marietta GA 30066 | **Riverdale:** 65742 River Park Drive, Riverdale GA 30274"
      }
    ]
  },
  {
    id: "emergency",
    title: "Emergency Services & Safety",
    letter: "M",
    icon: AlertTriangle,
    color: "from-yellow-500 to-yellow-600",
    bgGlow: "bg-yellow-100",
    questions: [
      {
        question: "Is Omega Premium Care an emergency service?",
        answer: "No, [[Omega Premium Care|Home]] is **not an emergency service** and should **not** be used for life-threatening conditions or medical emergencies. While we offer prompt care within a very short time, our [[services are designed for acute illnesses, chronic care management, and preventive health|Services]], not emergencies. Always call 911 or go to the nearest emergency room for emergencies."
      },
      {
        question: "Does Omega Premium Care cover hospital admissions or provide care in hospitals?",
        answer: "No, [[Omega Premium Care|Home]] does not cover hospital admissions, nor do our providers come to hospitals if there is an admission. Our [[services are strictly outpatient|Services]] and focused on preventive and acute care in our clinics or, for select plans, at home. For hospital-related needs, traditional health insurance or direct payment to the hospital is required."
      },
      {
        question: "What should I do in a medical emergency?",
        answer: "For any life-threatening emergency, always call 911 immediately or go to the nearest emergency room. Do not delay emergency care to contact us first. Our [[services are designed for non-emergency medical needs|Services]]."
      },
      {
        question: "Can I use Omega Premium Care for urgent but non-emergency situations?",
        answer: "Yes, we excel at handling urgent but non-emergency situations. Our 24/7 phone lines and [[priority scheduling|Services]] ensure you can get prompt care for concerns that need attention but are not life-threatening."
      },
      {
        question: "What if my child needs specialist care or referrals?",
        answer: "We coordinate referrals to specialists when needed as part of our [[comprehensive care|Services]]. However, specialist visits and treatments are not covered under our [[membership|Plans]] and would require separate payment or insurance coverage."
      }
    ]
  },
  {
    id: "plans",
    title: "Membership Plans",
    letter: "E",
    icon: Shield,
    color: "from-orange-500 to-orange-600",
    bgGlow: "bg-orange-100",
    questions: [
      {
        question: "What are the main membership plans offered?",
        answer: "We offer three primary [[membership tiers: Bronze (Essential Care), Silver (Enhanced Care), and Gold (Premium Care)|Plans]]. For those seeking the highest level of personalized care, we also offer the exclusive Diamond Concierge Plan.",
        link: "https://members.omegapediatrics.com/Plans"
      },
      {
        question: "What is included in the Bronze Plan?",
        answer: "The [[Bronze Plan ($250/month or $2,190/year)|Plans]] includes [[unlimited wellness visits, unlimited concern visits, unlimited ADHD visits, clogged ear irrigation, and school/daycare/sports forms|Services]]. Annual members also receive one complimentary sleep consultation and one lactation consultation."
      },
      {
        question: "What is included in the Silver Plan?",
        answer: "The [[Silver Plan ($400/month or $3,504/year)|Plans]] includes everything in Bronze, plus [[unlimited telemedicine visits, rapid tests (COVID, Flu, RSV, Strep), medical ear piercing with 1-year re-piercings (while membership is maintained), and priority scheduling|Services]]. Annual members receive two sleep and lactation consultations."
      },
      {
        question: "What is included in the Gold Plan?",
        answer: "The [[Gold Plan ($500/month or $4,380/year)|Plans]] includes everything in Silver, plus [[all vaccines, newborn circumcision, direct messaging to MD's cell phone, and extended consultation times|Services]]. Annual members receive three sleep and lactation consultations."
      },
      {
        question: "Are there financial benefits to choosing annual payment?",
        answer: "Yes, [[annual payment offers significant savings of approximately 27% compared to monthly billing|Plans]]. This provides excellent value for families committed to long-term care."
      },
      {
        question: "Are multi-child discounts available?",
        answer: "Yes! We offer [[multi-child discounts|Plans]] to make premium care accessible for larger families. Discounts can be as high as 45% off the base price per additional child."
      },
      {
        question: "What is the minimum commitment for monthly plans?",
        answer: "[[Monthly plans require a 2-month minimum commitment|Plans]]. You pay for the first and last month upfront, allowing you to cancel up to 5 weeks before your subscription period ends without being billed for additional months."
      }
    ]
  },
  {
    id: "concierge",
    title: "Diamond Concierge",
    letter: "G",
    icon: Sparkles,
    color: "from-pink-500 to-pink-600",
    bgGlow: "bg-pink-100",
    questions: [
      {
        question: "What makes the Diamond Concierge Plan special?",
        answer: "The [[Diamond Concierge Plan|Plans]] represents our most exclusive tier, offering unparalleled convenience and personalized care. It includes everything from our [[Gold Plan|Plans]] plus luxury amenities and [[services not available in other tiers|Services]]."
      },
      {
        question: "Does the Diamond Concierge Plan include home visits?",
        answer: "Yes, [[home visits are an exclusive feature of the Diamond Concierge Plan|Services]]. Our providers can visit your home for consultations, eliminating the need to bring sick children to the clinic. This service is not available in [[Bronze, Silver, or Gold plans|Plans]]."
      },
      {
        question: "What other exclusive services are included in Diamond Concierge?",
        answer: "[[Diamond Concierge|Plans]] includes [[24/7 personal pediatric nurse on-call, priority same-day home visits, luxury annual pediatric wellness retreats, private nutritionist consultations, educational & developmental consultations, complimentary technology & genetic testing, and free premium health devices|Services]]."
      },
      {
        question: "Can current members upgrade to Diamond Concierge?",
        answer: "Yes, current members can [[upgrade to Diamond Concierge|Plans]]. Annual members receive credit for their remaining plan value toward the upgrade. Monthly members can upgrade to a new annual Concierge plan at any time.",
        link: "https://members.omegapediatrics.com/ConciergeInquiry"
      },
      {
        question: "How do I inquire about Diamond Concierge pricing and availability?",
        answer: "Due to the exclusive nature of this plan, pricing and detailed information are provided through a personalized consultation. Please use our [[inquiry system|ConciergeInquiry]] to connect with our team for specific details.",
        link: "https://members.omegapediatrics.com/ConciergeInquiry"
      }
    ]
  },
  {
    id: "services",
    title: "Services & Benefits",
    letter: "A",
    icon: Heart,
    color: "from-green-500 to-green-600",
    bgGlow: "bg-green-100",
    questions: [
      {
        question: "What does 'unlimited wellness visits' mean?",
        answer: "[[Unlimited wellness visits|Services]] mean you can bring your child for regular check-ups, growth monitoring, and preventive care as often as needed without additional per-visit charges. This is included in all our [[membership plans|Plans]]."
      },
      {
        question: "What are concern visits?",
        answer: "[[Concern visits are appointments for when your child is sick or you have specific health concerns|Services]]. These are unlimited in all our [[plans|Plans]], so you never have to worry about the cost of bringing your child in when they're not feeling well."
      },
      {
        question: "What are sleep consultations and lactation support?",
        answer: "[[Annual plan members|Plans]] receive [[complimentary consultations with baby sleep specialist physicians and lactation experts|Services]]. Bronze gets 1 each, Silver gets 2 each, and Gold gets 3 each. These help with establishing healthy sleep patterns and supporting breastfeeding journeys."
      },
      {
        question: "Are vaccines included in membership plans?",
        answer: "[[All vaccines are included only in the Gold and Diamond Concierge plans|Services]]. [[Bronze and Silver members|Plans]] would need to pay separately for vaccines or use insurance coverage."
      },
      {
        question: "What telemedicine services do you offer?",
        answer: "[[Silver, Gold, and Diamond Concierge plans|Plans]] include [[unlimited telemedicine visits|Services]] for appropriate conditions, allowing convenient care from home when an in-person visit isn't necessary."
      },
      {
        question: "Do you provide school and sports physicals?",
        answer: "Yes, [[school, daycare, and sports forms and physicals are included in all membership plans|Services]] as part of our comprehensive care services."
      },
      {
        question: "What about the medical ear piercing service?",
        answer: "[[Medical ear piercing with 1-year unlimited re-piercings is included in Silver and Gold plans|Services]]. However, the re-piercing benefit only applies while your [[membership is maintained|Plans]]. If you cancel your membership, the re-piercing benefit ends."
      }
    ]
  },
  {
    id: "billing",
    title: "Billing & Payment",
    letter: "P",
    icon: CreditCard,
    color: "from-blue-500 to-blue-600",
    bgGlow: "bg-blue-100",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit cards, ACH bank transfers, Zelle, and PayPal. [[Annual plans|Plans]] can be paid via bank transfer for additional savings. Credit cards are available for both monthly and annual payments.",
        link: "https://members.omegapediatrics.com/Join"
      },
      {
        question: "How does membership billing work?",
        answer: "[[Memberships are billed by full calendar months|Plans]]. Your term begins on the 1st of your selected start month, regardless of when you sign up. [[Monthly plans require a 2-month minimum commitment|Plans]] (you pay for the first and last month upfront)."
      },
      {
        question: "What is your refund and cancellation policy?",
        answer: "All [[membership payments are non-refundable|Plans]] once services have started. [[Memberships can be cancelled|Plans]] by notifying us at least 5 weeks before the end of your paid term to avoid additional billing."
      },
      {
        question: "How are multi-child discounts calculated?",
        answer: "[[Multi-child discounts|Plans]] are applied per additional child. The first child pays full price, the second receives a 15% discount, the third gets 30%, and the fourth or more children receive 45% off their respective fees."
      },
      {
        question: "Can I change my payment frequency after joining?",
        answer: "Changes to payment frequency can typically be made at renewal time. Contact our team to discuss options for adjusting your [[billing cycle|Plans]]."
      },
      {
        question: "What is the minimum commitment for monthly plans?",
        answer: "[[Monthly plans require a 2-month minimum commitment|Plans]]. You pay for the first and last month upfront, allowing you to cancel up to 5 weeks before your subscription period ends without being billed for additional months."
      }
    ]
  },
  {
    id: "access",
    title: "Access & Community",
    letter: "C",
    icon: Users,
    color: "from-teal-500 to-teal-600",
    bgGlow: "bg-teal-100",
    questions: [
      {
        question: "How do I sign up for a membership?",
        answer: "You can [[sign up through our membership application system|Join]]. The process includes selecting your [[plan|Plans]], providing family information, and completing payment setup. Limited spots are available to ensure quality care.",
        link: "https://members.omegapediatrics.com/Join"
      },
      {
        question: "How do I access my member dashboard?",
        answer: "Once your [[membership is active|Plans]], you can access your [[member dashboard|Dashboard]] to view plan details, manage your account, and access exclusive member resources.",
        link: "https://members.omegapediatrics.com/Dashboard"
      },
      {
        question: "What member community resources are available?",
        answer: "Members gain access to our private parents community, including exclusive Facebook and WhatsApp groups, paid online events, masterclasses, parenting support, and direct updates from our team."
      },
      {
        question: "How do I book appointments?",
        answer: "Members can schedule appointments through our dedicated member portal or by calling our [[priority scheduling line|Services]]. We strive to accommodate appointments within 24-48 hours for non-urgent concerns."
      },
      {
        question: "Is there a patient portal for medical records?",
        answer: "Yes, we provide access to a secure, HIPAA-compliant patient portal for viewing medical records, test results, and secure communications with our medical team. This is separate from your [[membership dashboard|Dashboard]]."
      },
      {
        question: "Can I upgrade my membership plan?",
        answer: "Yes, you can [[upgrade your plan|Plans]] at any time. Stripe will charge a prorated amount for the remainder of your current billing cycle. Downgrades are only available at renewal time."
      }
    ]
  }
];

const allFAQsByCategory = faqCategories.reduce((acc, category) => {
  acc[category.id] = category.questions;
  return acc;
}, {});

export const faqsByPage = {
  Home: (allFAQsByCategory.general || []).concat(allFAQsByCategory.plans || [], allFAQsByCategory.billing || []),
  Plans: (allFAQsByCategory.plans || []).concat(allFAQsByCategory.billing || []),
  Services: (allFAQsByCategory.services || []).concat(allFAQsByCategory.emergency || []),
  FAQ: Object.values(allFAQsByCategory).flat(),
  Join: (allFAQsByCategory.billing || []).concat(allFAQsByCategory.plans || []),
  ConciergeInquiry: allFAQsByCategory.concierge || [],
  Dashboard: (allFAQsByCategory.access || []).concat(allFAQsByCategory.billing || []),
};

export default function ExpandableFAQSection() {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const renderAnswerWithLinks = (answerText) => {
    // Check if answerText is already a React element/JSX object
    if (React.isValidElement(answerText) || (typeof answerText === 'object' && answerText !== null)) {
      return answerText;
    }
    
    // If it's not a string, convert it to string
    if (typeof answerText !== 'string') {
      return <div>{String(answerText)}</div>;
    }

    // Process string answers with link parsing
    const parts = [];
    let lastIndex = 0;
    const linkRegex = /\[\[([^|]+)\|([^\]]+)\]\]/g; // Matches [[text to link|pageId]]
    let match;

    while ((match = linkRegex.exec(answerText)) !== null) {
      const [fullMatch, linkText, pageId] = match;

      // Add preceding plain text
      if (match.index > lastIndex) {
        let plainText = answerText.substring(lastIndex, match.index);
        // Apply bold and newline formatting to plain text
        plainText = plainText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        plainText = plainText.replace(/\n/g, '<br/>');
        parts.push(<span key={`plain-${lastIndex}`} dangerouslySetInnerHTML={{ __html: plainText }} />);
      }

      // Add the Link component
      parts.push(
        <Link
          key={`link-${match.index}`}
          to={createPageUrl(pageId)}
          className='text-link'
        >
          {linkText}
        </Link>
      );
      lastIndex = match.index + fullMatch.length;
    }

    // Add any remaining plain text after the last link
    if (lastIndex < answerText.length) {
      let plainText = answerText.substring(lastIndex);
      // Apply bold and newline formatting to remaining plain text
      plainText = plainText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      plainText = plainText.replace(/\n/g, '<br/>');
      parts.push(<span key={`plain-${lastIndex}`} dangerouslySetInnerHTML={{ __html: plainText }} />);
    }

    return <>{parts}</>;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions about our pediatric membership plans and services.
        </p>
      </div>

      {/* Modern alternating layout without lines */}
      <div className="relative max-w-6xl mx-auto">
        {/* Desktop layout */}
        <div className="hidden lg:block space-y-12">
          {faqCategories.map((category, index) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.id;
            const isEven = index % 2 === 0;
            
            return (
              <div 
                key={category.id}
                className={`relative ${isEven ? 'ml-0 mr-auto' : 'ml-auto mr-0'} w-4/5`}
              >
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                  <Button
                    onClick={() => toggleCategory(category.id)}
                    className={`w-full h-auto p-0 bg-gradient-to-r ${category.color} hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl`}
                    aria-label={`Toggle ${category.title} section`}
                  >
                    <div className="bg-white m-2 rounded-2xl w-full">
                      <div className="flex items-center gap-6 p-8">
                        {/* Puzzle-piece inspired icon with letter */}
                        <div className={`relative w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300`}>
                          <div className="absolute inset-1 bg-white rounded-xl opacity-20"></div>
                          <div className="text-3xl font-black text-white z-10">{category.letter}</div>
                          <Icon className="w-6 h-6 text-white absolute bottom-1 right-1 opacity-75" />
                        </div>
                        <div className="text-left flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            See questions about
                          </h3>
                          <p className="text-2xl text-gray-800 font-bold">
                            {category.title}
                          </p>
                        </div>
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} mr-4`}>
                          <ChevronDown className="w-8 h-8 text-gray-600" />
                        </div>
                      </div>
                    </div>
                  </Button>
                  
                  {isExpanded && (
                    <div className="bg-gradient-to-br from-gray-50 to-white">
                      <div className="p-8 pt-0">
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((faq, faqIndex) => (
                            <AccordionItem value={`faq-${faqIndex}`} key={faqIndex} className="border-gray-200">
                              <AccordionTrigger className="text-left text-lg font-semibold text-gray-800 hover:no-underline py-6">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-gray-600 text-base pb-6">
                                <div 
                                  className="prose prose-base max-w-none"
                                >
                                  {renderAnswerWithLinks(faq.answer)}
                                </div>
                                {faq.link && (
                                  <div className="mt-4">
                                    <a 
                                      href={faq.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 text-link font-medium"
                                    >
                                      Learn more
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile layout - stacked */}
        <div className="lg:hidden space-y-8">
          {faqCategories.map((category, index) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === category.id;
            
            return (
              <div key={category.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                <Button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full h-auto p-0 bg-gradient-to-r ${category.color} hover:opacity-90 transition-all duration-300 shadow-xl hover:shadow-2xl`}
                  aria-label={`Toggle ${category.title} section`}
                >
                  <div className="bg-white m-2 rounded-2xl w-full">
                    <div className="flex items-center gap-6 p-6">
                      {/* Puzzle-piece inspired icon with letter */}
                      <div className={`relative w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300`}>
                        <div className="absolute inset-1 bg-white rounded-xl opacity-20"></div>
                        <div className="text-2xl font-black text-white z-10">{category.letter}</div>
                        <Icon className="w-5 h-5 text-white absolute bottom-1 right-1 opacity-75" />
                      </div>
                      <div className="text-left flex-grow">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          See questions about
                        </h3>
                        <p className="text-xl text-gray-800 font-bold">
                          {category.title}
                        </p>
                      </div>
                      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                  </div>
                </Button>
                
                {isExpanded && (
                  <div className="bg-gradient-to-br from-gray-50 to-white">
                    <div className="p-6 pt-0">
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((faq, faqIndex) => (
                          <AccordionItem value={`faq-${faqIndex}`} key={faqIndex} className="border-gray-200">
                            <AccordionTrigger className="text-left text-base font-semibold text-gray-800 hover:no-underline py-4">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 text-sm pb-4">
                              <div 
                                className="prose prose-sm max-w-none"
                              >
                                {renderAnswerWithLinks(faq.answer)}
                              </div>
                              {faq.link && (
                                <div className="mt-3">
                                  <a 
                                    href={faq.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-link font-medium text-sm"
                                  >
                                    Learn more
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-16">
        <Link to={createPageUrl("FAQ")}>
          <Button size="lg" className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 btn-text-contrast" aria-label="View all frequently asked questions">
            See More FAQs
            <ExternalLink className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
