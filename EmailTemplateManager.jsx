
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { EmailTemplate } from "@/api/entities";
import { sendAdminEmail } from "@/api/functions";
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    Send, 
    Loader2, 
    Mail, 
    Code, 
    TestTube
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EmailTemplateManager({ members }) {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [testRecipient, setTestRecipient] = useState("");
    const [alert, setAlert] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        body: "",
        template_type: "custom",
        is_active: true,
        description: "",
        variables: ""
    });

    const templateTypes = [
        { value: "welcome_stripe", label: "Welcome Email (Stripe Payment)", description: "Sent when user pays via credit card" },
        { value: "application_received", label: "Application Received", description: "Sent when user signs up with non-card payment" },
        { value: "renewal_reminder", label: "Renewal Reminder", description: "Sent before membership renewal" },
        { value: "custom", label: "Custom Template", description: "For manual sending" }
    ];

    const commonVariables = [
        "{full_name}", "{email}", "{phone}", "{plan_tier}", "{payment_frequency}", 
        "{monthly_amount}", "{annual_amount}", "{start_date}", "{renewal_date}", 
        "{children_count}", "{current_date}"
    ];

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        setIsLoading(true);
        try {
            const allTemplates = await EmailTemplate.list('-created_date');
            setTemplates(allTemplates);
        } catch (error) {
            setAlert({ type: "error", message: "Failed to load templates: " + error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setFormData({
            name: "",
            subject: "",
            body: "<p>Dear {full_name},</p><p></p><p>Sincerely,<br/>The OmegaCare Team</p>",
            template_type: "custom",
            is_active: true,
            description: "",
            variables: JSON.stringify(commonVariables)
        });
        setIsCreating(true);
        setIsEditing(false);
    };

    const handleEdit = (template) => {
        setFormData({
            name: template.name,
            subject: template.subject,
            body: template.body,
            template_type: template.template_type,
            is_active: template.is_active,
            description: template.description || "",
            variables: template.variables || JSON.stringify(commonVariables)
        });
        setSelectedTemplate(template);
        setIsEditing(true);
        setIsCreating(false);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.subject || !formData.body) {
            setAlert({ type: "error", message: "Name, subject, and body are required." });
            return;
        }

        setIsSaving(true);
        try {
            if (isCreating) {
                await EmailTemplate.create(formData);
                setAlert({ type: "success", message: "Template created successfully!" });
            } else if (selectedTemplate) {
                await EmailTemplate.update(selectedTemplate.id, formData);
                setAlert({ type: "success", message: "Template updated successfully!" });
            }
            
            await loadTemplates();
            setIsCreating(false);
            setIsEditing(false);
            setSelectedTemplate(null);
        } catch (error) {
            setAlert({ type: "error", message: "Failed to save template: " + error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (template) => {
        if (!window.confirm(`Are you sure you want to delete the template "${template.name}"?`)) return;
        
        try {
            await EmailTemplate.delete(template.id);
            setAlert({ type: "success", message: "Template deleted successfully!" });
            await loadTemplates();
        } catch (error) {
            setAlert({ type: "error", message: "Failed to delete template: " + error.message });
        }
    };

    const handleToggleActive = async (template) => {
        try {
            await EmailTemplate.update(template.id, { is_active: !template.is_active });
            await loadTemplates();
            setAlert({ type: "success", message: `Template ${template.is_active ? 'deactivated' : 'activated'} successfully!` });
        } catch (error) {
            setAlert({ type: "error", message: "Failed to update template: " + error.message });
        }
    };

    const handleTestEmail = async () => {
        if (!testRecipient || !selectedTemplate) return;
        
        setIsTesting(true);
        setAlert(null); // Clear previous alerts
        try {
            // Replace variables with sample data for testing
            const testMember = members.find(m => m.email === testRecipient) || {
                full_name: "Test Member",
                email: testRecipient,
                plan_tier: "gold",
                payment_frequency: "monthly"
            };

            let testSubject = selectedTemplate.subject;
            let testBody = selectedTemplate.body;

            // Replace common variables
            Object.keys(testMember).forEach(key => {
                const placeholder = `{${key}}`;
                testSubject = testSubject.replace(new RegExp(placeholder, 'g'), testMember[key]);
                testBody = testBody.replace(new RegExp(placeholder, 'g'), testMember[key]);
            });

            // Replace current_date
            const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            testSubject = testSubject.replace(/{current_date}/g, currentDate);
            testBody = testBody.replace(/{current_date}/g, currentDate);

            // Add test prefix to subject
            testSubject = `[TEST] ${testSubject}`;

            await sendAdminEmail({ 
                to: testRecipient, 
                subject: testSubject, 
                body: testBody 
            });

            setAlert({ type: "success", message: "Test email sent successfully!" });
            setTestRecipient("");
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            setAlert({ type: "error", message: "Failed to send test email: " + errorMessage });
        } finally {
            setIsTesting(false);
        }
    };

    const insertVariable = (variable) => {
        setFormData(prev => ({
            ...prev,
            body: prev.body + variable
        }));
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            {alert && (
                <Alert variant={alert.type === 'error' ? 'destructive' : 'default'}>
                    <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-6 h-6 text-blue-600" />
                        Email Template Manager
                    </CardTitle>
                    <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Template
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {templates.map(template => (
                                <TableRow key={template.id}>
                                    <TableCell className="font-medium">{template.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {templateTypes.find(t => t.value === template.template_type)?.label || template.template_type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Switch 
                                                checked={template.is_active} 
                                                onCheckedChange={() => handleToggleActive(template)}
                                                size="sm"
                                            />
                                            <span className="text-sm">{template.is_active ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Preview: {template.name}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label>Subject</Label>
                                                            <div className="p-2 bg-gray-50 rounded">{template.subject}</div>
                                                        </div>
                                                        <div>
                                                            <Label>Body</Label>
                                                            <div className="p-2 bg-gray-50 rounded max-h-96 overflow-y-auto" 
                                                                 dangerouslySetInnerHTML={{ __html: template.body }} />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Select value={testRecipient} onValueChange={setTestRecipient}>
                                                                <SelectTrigger className="flex-1">
                                                                    <SelectValue placeholder="Select test recipient..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {members.map(member => (
                                                                        <SelectItem key={member.id} value={member.email}>
                                                                            {member.full_name} ({member.email})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <Button 
                                                                onClick={handleTestEmail} 
                                                                disabled={!testRecipient || isTesting}
                                                                className="bg-green-600 hover:bg-green-700"
                                                            >
                                                                {isTesting ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <>
                                                                        <TestTube className="w-4 h-4 mr-1" />
                                                                        Send Test
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(template)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => handleDelete(template)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {(isCreating || isEditing) && (
                <Card>
                    <CardHeader>
                        <CardTitle>{isCreating ? 'Create New Template' : 'Edit Template'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Template Name</Label>
                                    <Input 
                                        value={formData.name} 
                                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                        placeholder="e.g., Welcome Email"
                                    />
                                </div>
                                <div>
                                    <Label>Template Type</Label>
                                    <Select 
                                        value={formData.template_type} 
                                        onValueChange={(value) => setFormData(prev => ({...prev, template_type: value}))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {templateTypes.map(type => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea 
                                    value={formData.description} 
                                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                    placeholder="Describe when this template is used..."
                                />
                            </div>

                            <div>
                                <Label>Subject Line</Label>
                                <Input 
                                    value={formData.subject} 
                                    onChange={(e) => setFormData(prev => ({...prev, subject: e.target.value}))}
                                    placeholder="Email subject..."
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <Label>Email Body</Label>
                                    <div className="flex items-center gap-2">
                                        <Code className="w-4 h-4" />
                                        <span className="text-sm text-gray-600">Available variables:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {commonVariables.map(variable => (
                                                <Button 
                                                    key={variable}
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => insertVariable(variable)}
                                                    className="text-xs h-6"
                                                >
                                                    {variable}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <ReactQuill 
                                    theme="snow" 
                                    value={formData.body} 
                                    onChange={(value) => setFormData(prev => ({...prev, body: value}))}
                                    style={{ backgroundColor: 'white', minHeight: '200px' }}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch 
                                    checked={formData.is_active} 
                                    onCheckedChange={(checked) => setFormData(prev => ({...prev, is_active: checked}))}
                                />
                                <Label>Template is active</Label>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setIsCreating(false);
                                        setIsEditing(false);
                                        setSelectedTemplate(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            {isCreating ? 'Create' : 'Update'} Template
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
