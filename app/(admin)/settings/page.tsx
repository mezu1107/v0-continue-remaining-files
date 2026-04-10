"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import {
  Building2, User, Bell, Palette, Globe, CreditCard, Upload, Save,
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const { company, user } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your account and company settings."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 size-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building2 className="mr-2 size-4" /> Company
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 size-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 size-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 size-4" /> Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Profile Information</CardTitle>
              <CardDescription>Update your personal details and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success("Profile updated")
                }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-6">
                  <Avatar className="size-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {user?.avatar ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" type="button">
                      <Upload className="mr-2 size-4" /> Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Full Name</Label>
                    <Input defaultValue={user?.name} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue={user?.email} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Role</Label>
                    <Input defaultValue={user?.role} disabled />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Phone</Label>
                    <Input placeholder="+1 555-0000" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Bio</Label>
                  <Textarea placeholder="Tell us about yourself..." className="min-h-24" />
                </div>

                <Button type="submit" className="w-fit">
                  <Save className="mr-2 size-4" /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm mt-4">
            <CardHeader>
              <CardTitle className="text-base">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success("Password updated")
                }}
                className="flex flex-col gap-4 max-w-md"
              >
                <div className="flex flex-col gap-2">
                  <Label>Current Password</Label>
                  <Input type="password" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" />
                </div>
                <Button type="submit" className="w-fit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Company Information</CardTitle>
              <CardDescription>Update your company details and branding.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success("Company settings updated")
                }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className="flex size-20 items-center justify-center rounded-xl bg-primary text-primary-foreground text-2xl font-bold">
                    {company.logo}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" type="button">
                      <Upload className="mr-2 size-4" /> Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">Recommended: 512x512px</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Company Name</Label>
                    <Input defaultValue={company.name} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Industry</Label>
                    <Input defaultValue={company.industry} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue={company.email} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Phone</Label>
                    <Input defaultValue={company.phone} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Address</Label>
                  <Textarea defaultValue={company.address} className="min-h-16" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>Currency</Label>
                    <Select defaultValue={company.currency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Timezone</Label>
                    <Select defaultValue={company.timezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-fit">
                  <Save className="mr-2 size-4" /> Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(v) => {
                    setEmailNotifications(v)
                    toast.success(v ? "Email notifications enabled" : "Email notifications disabled")
                  }}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={(v) => {
                    setPushNotifications(v)
                    toast.success(v ? "Push notifications enabled" : "Push notifications disabled")
                  }}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <p className="font-medium text-foreground">Marketing Emails</p>
                  <p className="text-xs text-muted-foreground">Receive product updates and offers</p>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={(v) => {
                    setMarketingEmails(v)
                    toast.success(v ? "Marketing emails enabled" : "Marketing emails disabled")
                  }}
                />
              </div>

              <div className="mt-4">
                <h4 className="font-medium text-foreground mb-3">Notify me about:</h4>
                <div className="flex flex-col gap-3">
                  {[
                    "New project assignments",
                    "Invoice payments received",
                    "New support tickets",
                    "Team member activity",
                    "Lead conversions",
                    "Contract expirations",
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <Label className="text-sm font-normal">{item}</Label>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "light", label: "Light", bg: "bg-white", border: "border-gray-200" },
                    { id: "dark", label: "Dark", bg: "bg-gray-900", border: "border-gray-700" },
                    { id: "system", label: "System", bg: "bg-gradient-to-r from-white to-gray-900", border: "border-gray-400" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:border-primary ${theme.border}`}
                      onClick={() => toast.success(`Theme set to ${theme.label}`)}
                    >
                      <div className={`size-12 rounded-lg ${theme.bg} border border-border`} />
                      <span className="text-sm font-medium text-foreground">{theme.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label>Sidebar</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Collapsed by default</span>
                  <Switch />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment methods.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="rounded-lg border border-primary bg-primary/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">Enterprise Plan</p>
                    <p className="text-sm text-muted-foreground">$299/month &middot; Billed annually</p>
                  </div>
                  <Button variant="outline" size="sm">Change Plan</Button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <CreditCard className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 12/2027</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>

              <Button variant="outline" className="w-fit">
                <CreditCard className="mr-2 size-4" /> Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
