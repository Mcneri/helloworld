import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ConciergeInquiry } from "@/api/entities";
import { useApiError, ApiErrorAlert } from "../ApiErrorHandler";
import { Sparkles, ArrowRight, Loader2, Mail, Phone } from "lucide-react";

export default function DiamondConciergeSection({ memberStatus }) {
    const navigate = useNavigate();
    const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
    const [leadData, setLeadData] = useState({ email: '', phone: '' });
    const [leadTermsAccepted, setLeadTermsAccepted] = useState(false);
    const [isSubmittingLead, setIsSubmittingLead] = useState(false);
    const { error: apiError, handleApiCall, clearError: clearApiError } = useApiError();

    const handleLeadInputChange = (field, value) => {
        setLeadData(prev => ({ ...prev, [field]: value }));
    };

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        clearApiError();

        if (!leadTermsAccepted) {
            alert("You must accept the terms and conditions to proceed.");
            return;
        }

        setIsSubmittingLead(true);

        try {
            const newRecord = await handleApiCall(() => ConciergeInquiry.create({
                email: leadData.email,
                phone: leadData.phone,
                terms_accepted: true,
                status: 'lead',
            }));

            if (newRecord) {
                navigate(createPageUrl(`ConciergeInquiry?id=${newRecord.id}`));
            }
        } catch (error) {
            // Error is handled by useApiError
        } finally {
            setIsSubmittingLead(false);
            setIsLeadDialogOpen(false);
        }
    };
    
    return (
        <div className="mt-20 animate-fade-in">
            {apiError && (
              <ApiErrorAlert 
                error={apiError} 
                onDismiss={clearApiError}
                className="mb-6"
              />
            )}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Premium Diamond Concierge Care</h2>
            <Card className="card-hover bg-gradient-to-r from-indigo-700 via-purple-700 to-teal-700 text-white shadow-2xl border-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                    <div className="absolute top-4 right-[-32px] w-40 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 transform rotate-45 shadow-lg flex items-center justify-center">
                        <span className="text-purple-900 font-bold text-sm">
                        Diamond
                        </span>
                    </div>
                </div>
    
                <CardContent className="p-10 grid md:grid-cols-3 items-center gap-8">
                    <div className="md:col-span-1 text-center">
                        <Sparkles className="w-16 h-16 mx-auto text-yellow-300 mb-4 animate-pulse" />
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-3xl font-bold mb-3">Diamond <Link to={createPageUrl("Services")} className="text-yellow-300 hover:underline">Concierge Plans</Link> Available</h3>
                        <p className="text-indigo-100 text-lg mb-4">
                        For ultimate convenience and access, we offer exclusive Diamond <Link to={createPageUrl("Services")} className="text-indigo-200 hover:underline">Concierge plans</Link> - the pinnacle of <Link to={createPageUrl("Services")} className="text-indigo-200 hover:underline">concierge pediatrics in Atlanta</Link>. These bespoke <Link to={createPageUrl("Plans")} className="text-indigo-200 hover:underline">DPC pediatrics packages</Link> include <Link to={createPageUrl("Services")} className="text-indigo-200 hover:underline">home visits, advanced testing, and unparalleled direct access</Link> to our pediatricians for families throughout Roswell, Alpharetta, Sandy Springs, and beyond.
                        </p>
                        {memberStatus.isMember ? (
                        <>
                            <div className="mb-4 p-4 bg-black/20 rounded-lg">
                            <p className="font-semibold text-lg text-yellow-300">Upgrade Policy for Active Members:</p>
                            {memberStatus.details && memberStatus.details.payment_frequency === 'annual' ? (
                                <p className="text-sm text-indigo-200 mt-1">
                                As an annual member, your remaining plan value will be credited towards the Diamond Concierge upgrade.
                                </p>
                            ) : (
                                <p className="text-sm text-indigo-200 mt-1">
                                As a monthly member, you can upgrade to a new annual Concierge plan at any time. Monthly payments do not apply as credit.
                                </p>
                            )}
                            </div>
                            <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
                            <span className="font-semibold text-lg">Plans starting at <span className="text-yellow-300">$30,000 / year</span></span>
                            <Link to={createPageUrl("ConciergeInquiry")}>
                                <Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-indigo-700 transition-transform hover:scale-105 active:scale-100">
                                Inquire to Upgrade
                                </Button>
                            </Link>
                            </div>
                        </>
                        ) : (
                        <div className="bg-black/20 p-4 rounded-lg">
                            <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full bg-white/10 border-white text-white hover:bg-white hover:text-indigo-700 transition-transform hover:scale-105 active:scale-100">
                                Request to View Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
                                <DialogHeader className="text-center">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <Sparkles className="w-8 h-8 text-purple-600"/>
                                </div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">Access Diamond Concierge Details</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Please provide your contact information to view the detailed plan page and connect with our team.
                                </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleLeadSubmit} className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lead_email" className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4"/>Email</Label>
                                    <Input id="lead_email" type="email" placeholder="your.email@example.com" value={leadData.email} onChange={(e) => handleLeadInputChange('email', e.target.value)} required
                                    className="bg-white/70 transition-colors focus:bg-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lead_phone" className="flex items-center gap-2 text-gray-700"><Phone className="w-4 h-4"/>Phone</Label>
                                    <Input id="lead_phone" type="tel" placeholder="(555) 123-4567" value={leadData.phone} onChange={(e) => handleLeadInputChange('phone', e.target.value)}
                                    className="bg-white/70 transition-colors focus:bg-white" />
                                </div>
        
                                <div className="flex items-start space-x-3 pt-2">
                                    <Checkbox
                                    id="lead_terms"
                                    checked={leadTermsAccepted}
                                    onCheckedChange={setLeadTermsAccepted}
                                    className="mt-1"
                                    />
                                    <div className="grid gap-1.5 leading-none">
                                    <Label htmlFor="lead_terms" className="font-medium text-gray-800">
                                        I agree to the terms and conditions. <span className="text-red-500">*</span>
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                        I accept that Omega Pediatrics may contact me about this inquiry. Your information will never be sold or used with third parties.
                                        <a href="https://www.omegapediatrics.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">View full policy</a>.
                                    </p>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 text-lg transition-transform hover:scale-105 active:scale-100" disabled={isSubmittingLead}>
                                    {isSubmittingLead ? <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Processing...</> :
                                    (<>View Details <ArrowRight className="w-5 h-5 ml-2"/></>)}
                                </Button>
                                </form>
                            </DialogContent>
                            </Dialog>
                        </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}