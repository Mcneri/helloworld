import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

// Hook for managing API errors in components
export function useApiError() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async (apiCall, options = {}) => {
    const { 
      onSuccess, 
      onError, 
      loadingMessage = 'Processing...',
      successMessage 
    } = options;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      
      if (onSuccess) {
        onSuccess(result, successMessage);
      }
      
      return result;
    } catch (err) {
      console.error('API call failed:', err);
      
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      
      if (onError) {
        onError(err, errorMessage);
      }
      
      throw err; // Re-throw so calling code can handle it if needed
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    error,
    isLoading,
    handleApiCall,
    clearError,
    setError
  };
}

// Helper function to extract meaningful error messages
function getErrorMessage(error) {
  // Handle different types of errors
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    if (data?.error) {
      return data.error;
    }
    
    if (data?.message) {
      return data.message;
    }
    
    switch (status) {
      case 400:
        return 'Invalid request. Please check your information and try again.';
      case 401:
        return 'You need to be logged in to perform this action.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return `Request failed with status ${status}. Please try again.`;
    }
  }
  
  if (error.request) {
    // Request made but no response received
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  if (error.message) {
    // Something else happened
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

// Reusable Error Alert Component
export function ApiErrorAlert({ error, onDismiss, onRetry, className = "" }) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className={`relative ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="pr-8">
        {error}
      </AlertDescription>
      
      {/* Dismiss button */}
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 h-6 w-6 p-0 hover:bg-red-100"
          onClick={onDismiss}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      {/* Retry button */}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 bg-white border-red-200 text-red-700 hover:bg-red-50"
          onClick={onRetry}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Try Again
        </Button>
      )}
    </Alert>
  );
}