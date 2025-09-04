
import React, { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendAdminEmail } from "@/api/functions";
import { Loader2, Send, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Lazy load ReactQuill since it's heavy and not immediately needed
const ReactQuill = lazy(() => import("react-quill"));
// Note: 'react-quill/dist/quill.snow.css' might need to be imported directly
// or handled by the lazy-loaded component's module bundling.
// For now, following the outline, which implies it's handled or can be omitted.
// If styles are missing, re-add: import "react-quill/dist/quill.snow.css";

export default function EmailSender({ members, conciergeInquiries }) {
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null);
    const [isEditorReady, setIsEditorReady] = useState(false);

    const emailTemplates = [
        {
            value: "renewal_reminder",
            label: "Membership Renewal Reminder",
            subject: "Action Required: Your OmegaCare Membership Renewal is Approaching!",
            body: `<p>Dear {full_name},</p><p>This is a friendly reminder that your OmegaCare Pediatrics membership is scheduled for renewal on [Renewal Date].</p><p>To ensure uninterrupted access, your membership will automatically renew. If you wish to make changes, please visit your Member Dashboard or contact us.</p><p>Thank you for being a valued member!</p><p>Sincerely,<br/>The OmegaCare Team</p>`
        },
        {
            value: "custom_message",
            label: "Custom Message",
            subject: "",
            body: "<p>Dear {full_name},</p><p><br></p><p>Sincerely,<br/>The OmegaCare Team</p>"
        }
    ];

    const handleTemplateChange = (templateValue) => {
        const template = emailTemplates.find(t => t.value === templateValue);
        if (template) {
            setSubject(template.subject);
            let newBody = template.body;

            // If a recipient is already selected, try to populate their name in the new template
            if (recipient) {
                const allRecipients = [...members, ...(conciergeInquiries || [])];
                const selectedPerson = allRecipients.find(p => p.email === recipient);
                if (selectedPerson) {
                    newBody = newBody.replace(/{full_name}/g, selectedPerson.full_name);
                } else {
                    // If manually typed email, remove the placeholder
                    newBody = newBody.replace(/{full_name}/g, 'Valued Member');
                }
            }
            setBody(newBody);
        }
    };
    
    const handleRecipientChange = (email) => {
        setRecipient(email);
        const allRecipients = [...members, ...(conciergeInquiries || [])];
        const selectedPerson = allRecipients.find(p => p.email === email);
        
        // If a person is selected from the list, update the name in the current body
        if (selectedPerson) {
            let currentBody = body;
            // This regex is a bit greedy, so we need a more specific way to find the name to replace.
            // A simple replacement might be best.
            // Let's assume we replace a placeholder or the first part of "Dear X,"
            const dearRegex = /Dear (.*?),/;
            if (dearRegex.test(currentBody)) {
                setBody(currentBody.replace(dearRegex, `Dear ${selectedPerson.full_name},`));
            } else {
                setBody(currentBody.replace(/{full_name}/g, selectedPerson.full_name));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        setSendStatus(null);
        try {
            await sendAdminEmail({ to: recipient, subject, body });
            setSendStatus({ type: "success", message: "Email sent successfully!" });
            setRecipient("");
            setSubject("");
            setBody("");
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setSendStatus({ type: "error", message: `Failed to send email: ${errorMessage}` });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail className="w-6 h-6 text-teal-600"/> Send Email Communication</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient</Label>
                        <div className="flex flex-col md:flex-row gap-2">
                            <Input 
                                id="recipient" 
                                value={recipient} 
                                onChange={(e) => setRecipient(e.target.value)} 
                                placeholder="Type email address manually..." 
                                required 
                                className="flex-grow"
                            />
                            <Select onValueChange={handleRecipientChange}>
                                <SelectTrigger className="w-full md:w-[280px]">
                                    <SelectValue placeholder="Or select from a list..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Members</SelectLabel>
                                        {members.map(member => (
                                            <SelectItem key={`member-${member.id}`} value={member.email}>
                                                {member.full_name} ({member.email})
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                    {conciergeInquiries && conciergeInquiries.length > 0 && (
                                        <SelectGroup>
                                            <SelectLabel>Concierge Inquiries</SelectLabel>
                                            {(conciergeInquiries || []).map(inquiry => (
                                                <SelectItem key={`inquiry-${inquiry.id}`} value={inquiry.email}>
                                                    {inquiry.full_name || 'Lead'} ({inquiry.email})
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="template">Email Template</Label>
                         <Select onValueChange={handleTemplateChange}>
                            <SelectTrigger id="template">
                                <SelectValue placeholder="Select a template..." />
                            </SelectTrigger>
                            <SelectContent>
                                {emailTemplates.map(template => (
                                    <SelectItem key={template.value} value={template.value}>
                                        {template.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" required />
                    </div>

                    <div>
                        <Label>Body</Label>
                        <Suspense fallback={
                            <div className="border rounded-md p-4 bg-gray-50 animate-pulse">
                                <div className="space-y-2">
                                    <div className="h-8 bg-gray-200 rounded"></div>
                                    <div className="h-32 bg-gray-200 rounded"></div>
                                </div>
                                <div className="flex items-center justify-center mt-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                    <span className="ml-2 text-gray-500">Loading editor...</span>
                                </div>
                            </div>
                        }>
                            <ReactQuill 
                                theme="snow" 
                                value={body} 
                                onChange={setBody} 
                                style={{ backgroundColor: 'white' }}
                                onFocus={() => setIsEditorReady(true)}
                            />
                        </Suspense>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSending || !recipient || !subject || !body}>
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Email
                                </>
                            )}
                        </Button>
                    </div>

                    {sendStatus && (
                        <Alert variant={sendStatus.type === 'error' ? 'destructive' : 'default'}>
                            <AlertTitle>{sendStatus.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                            <AlertDescription>{sendStatus.message}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
