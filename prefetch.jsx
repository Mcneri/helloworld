// Page component prefetching utilities
const prefetchedPages = new Set();
const prefetchedData = new Set();

// Map of page paths to their lazy-loaded components for prefetching
const pageComponentMap = {
  '/Plans': () => import('../../pages/Plans'),
  '/Services': () => import('../../pages/Services'),
  '/Join': () => import('../../pages/Join'),
  '/FAQ': () => import('../../pages/FAQ'),
  '/Dashboard': () => import('../../pages/Dashboard'),
  '/Forum': () => import('../../pages/Forum'),
  '/ConciergeInquiry': () => import('../../pages/ConciergeInquiry'),
  '/Admin': () => import('../../pages/Admin'),
  '/MemberSignIn': () => import('../../pages/MemberSignIn'),
  '/AdminSignIn': () => import('../../pages/AdminSignIn'),
};

// Prefetch page JavaScript bundle
export const prefetchPage = async (path) => {
  if (prefetchedPages.has(path)) return;
  
  const normalizedPath = path.split('?')[0]; // Remove query params for mapping
  const componentLoader = pageComponentMap[normalizedPath];
  
  if (!componentLoader) {
    console.warn(`No component mapping found for path: ${normalizedPath}`);
    return;
  }

  try {
    prefetchedPages.add(path);
    await componentLoader();
    console.log(`✅ Prefetched page: ${path}`);
  } catch (error) {
    prefetchedPages.delete(path);
    console.warn(`❌ Failed to prefetch page: ${path}`, error);
  }
};

// Prefetch data for specific pages
export const prefetchData = async (path) => {
  if (prefetchedData.has(path)) return;
  
  const normalizedPath = path.split('?')[0];
  
  try {
    prefetchedData.add(path);
    
    // Import entities dynamically to avoid loading them on every page
    switch (normalizedPath) {
      case '/Dashboard':
        const { User } = await import('../.@/api/entities/User');
        const { Member } = await import('../.@/api/entities/Member');
        try {
          const userPromise = User.me();
          const memberPromise = userPromise.then(user => 
            user?.member_id ? Member.get(user.member_id) : null
          );
          await Promise.all([userPromise, memberPromise]);
          console.log('✅ Prefetched Dashboard data');
        } catch (error) {
          // User might not be logged in, which is fine
          console.log('ℹ️ Dashboard data prefetch skipped (user not authenticated)');
        }
        break;
        
      case '/Forum':
        const { ForumPost } = await import('../.@/api/entities/ForumPost');
        try {
          await ForumPost.list('-created_date', 20);
          console.log('✅ Prefetched Forum data');
        } catch (error) {
          console.warn('⚠️ Forum data prefetch failed:', error);
        }
        break;
        
      case '/Admin':
        const { User: AdminUser } = await import('../.@/api/entities/User');
        const { Member: AdminMember } = await import('../.@/api/entities/Member');
        const { ConciergeInquiry } = await import('../.@/api/entities/ConciergeInquiry');
        try {
          const user = await AdminUser.me();
          if (user?.role === 'admin') {
            await Promise.all([
              AdminMember.list(),
              ConciergeInquiry.list()
            ]);
            console.log('✅ Prefetched Admin data');
          }
        } catch (error) {
          console.log('ℹ️ Admin data prefetch skipped (not admin or not authenticated)');
        }
        break;
        
      default:
        console.log(`ℹ️ No data prefetching configured for: ${normalizedPath}`);
    }
  } catch (error) {
    prefetchedData.delete(path);
    console.warn(`❌ Failed to prefetch data for: ${path}`, error);
  }
};

// Prefetch critical CSS for a page (using resource hints)
export const prefetchCriticalResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    link.setAttribute('data-prefetch', 'true');
    document.head.appendChild(link);
  });
};

// Strategic prefetching based on user journey patterns
export const strategicPrefetch = async (currentPath) => {
  // Define common navigation patterns
  const navigationPatterns = {
    '/': ['/Plans', '/Services'], // From home, users often go to Plans or Services
    '/Plans': ['/Join'], // From plans, users often go to Join
    '/Services': ['/Plans', '/Join'], // From services, users often check Plans or Join
    '/Join': ['/Dashboard', '/ThankYou'], // After joining, users go to Dashboard or Thank You
    '/MemberSignIn': ['/Dashboard'], // After sign in, users go to Dashboard
    '/AdminSignIn': ['/Admin'], // After admin sign in, users go to Admin
    '/Dashboard': ['/Forum'], // From dashboard, users might check Forum
  };
  
  const nextPages = navigationPatterns[currentPath] || [];
  
  // Prefetch likely next pages with a small delay to not impact current page performance
  setTimeout(() => {
    nextPages.forEach(page => {
      prefetchPage(page);
    });
  }, 1000);
};

// Clean up prefetch hints when they're no longer needed
export const cleanupPrefetchHints = () => {
  document.querySelectorAll('link[data-prefetch="true"]').forEach(link => {
    link.remove();
  });
};