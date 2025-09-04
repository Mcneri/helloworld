import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronRight, Home } from 'lucide-react';

// Function to format the breadcrumb text
const formatBreadcrumb = (str) => {
  // Replace page IDs or complex names with friendly text
  const nameMap = {
    'MemberSignIn': 'Member Sign In',
    'AdminSignIn': 'Admin Sign In',
    'PostDetails': 'Post Details',
    'ConciergeInquiry': 'Concierge Inquiry',
    'ThankYou': 'Thank You'
  };
  if (nameMap[str]) return nameMap[str];

  // Add spaces before capital letters (for camelCase)
  return str.replace(/([A-Z])/g, ' $1').trim();
};

export default function Breadcrumbs() {
  const location = useLocation();
  const homeUrl = createPageUrl('Home');

  // Don't display on the homepage
  if (location.pathname === '/' || location.pathname === homeUrl) {
    return null;
  }
  
  // Ignore query parameters for path generation
  const pathnames = location.pathname.split('?')[0].split('/').filter(x => x);

  return (
    <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link to={homeUrl} className="flex items-center gap-2 hover:text-teal-600 transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const formattedValue = formatBreadcrumb(value);

          // Don't create breadcrumb for the homepage segment if it appears
          if (value.toLowerCase() === 'home') return null;

          return (
            <li key={to} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              {last ? (
                <span className="font-semibold text-gray-700" aria-current="page">
                  {formattedValue}
                </span>
              ) : (
                <Link to={to} className="hover:text-teal-600 transition-colors">
                  {formattedValue}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}