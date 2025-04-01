import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

function QRScanner({ onClose }) {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    // Create scanner with responsive dimensions
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: Math.min(250, window.innerWidth - 50),
        height: Math.min(250, window.innerWidth - 50),
      },
      fps: 5,
      rememberLastUsedCamera: true,
      showTorchButtonIfSupported: true,
      aspectRatio: 1,
      videoConstraints: {
        facingMode: 'environment'
      }
    });

    const success = (result) => {
      scanner.clear();
      setScanResult(result);
      setScanning(false);
      
      try {
        if (result.includes('restaurant/')) {
          const restaurantId = result.split('restaurant/')[1];
          navigate(`/preorder/${restaurantId}`);
          if (onClose) onClose();
        } else {
          setError('Invalid QR Code');
        }
      } catch (err) {
        setError('Failed to process QR code');
      }
    };

    const error = (err) => {
      console.warn(err);
    };

    scanner.render(success, error);

    // Handle window resize
    const handleResize = () => {
      scanner.clear();
      scanner.render(success, error);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      scanner.clear();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-auto overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                Scan QR Code
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">
                Point your camera at the QR code on your table
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close scanner"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scanner Area */}
        <div className="p-4 sm:p-6">
          <div className="relative">
            {/* Scanning Animation Overlay */}
            {scanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-lg">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan"></div>
                </div>
              </div>
            )}
            
            {/* Scanner Container */}
            <div 
              id="reader" 
              className="overflow-hidden rounded-lg mx-auto"
              style={{
                maxWidth: '100%',
                '--scanner-border': '2px solid #3b82f6',
              }}
            ></div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-red-100 rounded-full flex-shrink-0">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-700 text-sm sm:text-base font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Camera Active</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Secure Scanning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRScanner; 