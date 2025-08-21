import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";

interface PrivacyConsentProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function PrivacyConsent({ isOpen, onAccept, onDecline }: PrivacyConsentProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            Privacy & Camera Access
          </DialogTitle>
          <p className="text-gray-600">
            Your privacy is our priority. All analysis happens locally on your device.
          </p>
        </DialogHeader>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <span className="text-sm text-gray-700">
              No video or audio data is stored or transmitted
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <span className="text-sm text-gray-700">
              All processing happens locally in your browser
            </span>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <span className="text-sm text-gray-700">
              You can disable monitoring at any time
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDecline}
          >
            Decline
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={onAccept}
          >
            Allow Camera
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
