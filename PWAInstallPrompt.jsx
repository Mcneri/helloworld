
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Smartphone, Download, Home } from "lucide-react";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if user is on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed (running in standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      window.navigator.standalone || 
                      document.referrer.includes('android-app://');
    setIsStandalone(standalone);

    // Listen for the beforeinstallprompt event (Chrome/Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show our custom prompt after a short delay
      setTimeout(() => {
        if (!getDismissedStatus()) {
          setShowPrompt(true);
        }
      }, 3000); // Show after 3 seconds
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show prompt after page load if not dismissed
    if (iOS && !standalone && !getDismissedStatus()) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds on iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const getDismissedStatus = () => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
    
    if (dismissed && dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      return daysSinceDismissed < 7; // Don't show again for 7 days
    }
    return false;
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Chrome/Android - trigger native prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // iOS - we can't programmatically trigger install, just show instructions
      // The instructions are already visible in the prompt
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', Date.now().toString());
  };

  // Don't show if already installed or if prompt shouldn't be shown
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-[99999] md:left-auto md:right-4 md:max-w-sm">
      <Card className="shadow-2xl border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-grow">
              <h3 className="font-bold text-gray-900 mb-1">
                Get the App Experience!
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Add Omega Pediatrics to your home screen for faster access and a better experience.
              </p>

              {isIOS ? (
                <div className="text-xs text-gray-600 mb-3 bg-blue-50 p-2 rounded-lg">
                  <div className="font-semibold mb-1">To install on iPhone/iPad:</div>
                  <div className="space-y-1">
                    <div>1. Tap the Share button <span className="inline-block w-4 h-4 bg-blue-500 rounded text-white text-center text-xs leading-4">↗</span> below</div>
                    <div>2. Select "Add to Home Screen"</div>
                    <div>3. Tap "Add" to confirm</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-600 mb-3 bg-green-50 p-2 rounded-lg">
                  <div className="font-semibold mb-1">Benefits:</div>
                  <div>• Launch directly from home screen</div>
                  <div>• Faster loading times</div>
                  <div>• Full-screen experience</div>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  {isIOS ? "Show Me How" : "Install App"}
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
