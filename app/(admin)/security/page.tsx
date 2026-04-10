"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDateTime } from "@/lib/mock-api"
import {
  Shield, ShieldCheck, ShieldAlert, Key, Lock, Smartphone,
  Globe, AlertTriangle, CheckCircle2, XCircle, Eye, RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

const loginActivity = [
  { id: 1, user: "Amir Khan", avatar: "AK", device: "Chrome on Windows", ip: "192.168.1.1", location: "San Francisco, US", time: "2026-02-27T09:00:00Z", status: "success" },
  { id: 2, user: "Sara Malik", avatar: "SM", device: "Safari on macOS", ip: "192.168.1.2", location: "New York, US", time: "2026-02-27T08:30:00Z", status: "success" },
  { id: 3, user: "Unknown", avatar: "?", device: "Firefox on Linux", ip: "185.220.101.1", location: "Unknown", time: "2026-02-27T07:15:00Z", status: "failed" },
  { id: 4, user: "Dev Patel", avatar: "DP", device: "Chrome on macOS", ip: "192.168.1.3", location: "Austin, US", time: "2026-02-26T16:45:00Z", status: "success" },
  { id: 5, user: "Unknown", avatar: "?", device: "Unknown Browser", ip: "45.33.32.156", location: "Unknown", time: "2026-02-26T14:20:00Z", status: "failed" },
]

const securityPolicies = [
  { id: 1, name: "Password Minimum Length", value: "12 characters", enabled: true },
  { id: 2, name: "Require Uppercase", value: "At least 1", enabled: true },
  { id: 3, name: "Require Number", value: "At least 1", enabled: true },
  { id: 4, name: "Require Special Character", value: "At least 1", enabled: true },
  { id: 5, name: "Password Expiry", value: "90 days", enabled: false },
  { id: 6, name: "Session Timeout", value: "30 minutes", enabled: true },
  { id: 7, name: "Max Login Attempts", value: "5 attempts", enabled: true },
  { id: 8, name: "IP Whitelist", value: "Not configured", enabled: false },
]

export default function SecurityPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(true)
  const [ssoEnabled, setSsoEnabled] = useState(false)
  const [ipRestriction, setIpRestriction] = useState(false)

  const securityScore = 85

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Security"
        description="Manage security settings and audit logs."
        breadcrumbs={[{ label: "Security" }]}
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold text-foreground">{securityScore}%</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <Progress value={securityScore} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Key className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">2FA Enabled</p>
              <p className="text-xl font-bold text-foreground">4/6 Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Failed Logins (24h)</p>
              <p className="text-xl font-bold text-foreground">2</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="text-xl font-bold text-foreground">3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Login Activity</TabsTrigger>
          <TabsTrigger value="policies">Password Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Smartphone className="size-4" /> Two-Factor Authentication
                </CardTitle>
                <CardDescription>Add an extra layer of security to user accounts.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="2fa">Require 2FA for all users</Label>
                  <Switch
                    id="2fa"
                    checked={twoFAEnabled}
                    onCheckedChange={(v) => {
                      setTwoFAEnabled(v)
                      toast.success(v ? "2FA enabled" : "2FA disabled")
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  When enabled, all users must set up two-factor authentication.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe className="size-4" /> Single Sign-On (SSO)
                </CardTitle>
                <CardDescription>Enable SSO with your identity provider.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sso">Enable SSO</Label>
                  <Switch
                    id="sso"
                    checked={ssoEnabled}
                    onCheckedChange={(v) => {
                      setSsoEnabled(v)
                      toast.success(v ? "SSO enabled" : "SSO disabled")
                    }}
                  />
                </div>
                {ssoEnabled && (
                  <div className="flex flex-col gap-2">
                    <Label>SSO Provider URL</Label>
                    <Input placeholder="https://your-idp.com/sso" />
                    <Button size="sm" className="w-fit">Configure SSO</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="size-4" /> IP Restriction
                </CardTitle>
                <CardDescription>Restrict access to specific IP addresses.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ip">Enable IP Whitelist</Label>
                  <Switch
                    id="ip"
                    checked={ipRestriction}
                    onCheckedChange={(v) => {
                      setIpRestriction(v)
                      toast.success(v ? "IP restriction enabled" : "IP restriction disabled")
                    }}
                  />
                </div>
                {ipRestriction && (
                  <div className="flex flex-col gap-2">
                    <Label>Allowed IPs (one per line)</Label>
                    <textarea
                      className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="192.168.1.1&#10;10.0.0.0/24"
                    />
                    <Button size="sm" className="w-fit">Save IPs</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="size-4" /> API Security
                </CardTitle>
                <CardDescription>Manage API keys and access tokens.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Key className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Production API Key</p>
                      <p className="text-xs text-muted-foreground">Created Feb 15, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="size-8">
                      <Eye className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8">
                      <RefreshCw className="size-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-fit">
                  Generate New Key
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent Login Activity</CardTitle>
              <CardDescription>Monitor login attempts and active sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="flex flex-col gap-3">
                  {loginActivity.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10">
                          <AvatarFallback
                            className={`text-xs ${
                              log.status === "failed" ? "bg-red-500/10 text-red-600" : "bg-primary/10 text-primary"
                            }`}
                          >
                            {log.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{log.user}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.device} &middot; {log.ip}
                          </p>
                          <p className="text-xs text-muted-foreground">{log.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={log.status === "success" ? "default" : "destructive"}
                          className={`text-xs ${log.status === "success" ? "bg-emerald-600" : ""}`}
                        >
                          {log.status === "success" ? (
                            <CheckCircle2 className="mr-1 size-3" />
                          ) : (
                            <XCircle className="mr-1 size-3" />
                          )}
                          {log.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDateTime(log.time)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Password Policies</CardTitle>
              <CardDescription>Configure password requirements and security rules.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {securityPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">{policy.name}</p>
                      <p className="text-xs text-muted-foreground">{policy.value}</p>
                    </div>
                    <Switch
                      checked={policy.enabled}
                      onCheckedChange={() => toast.success(`${policy.name} updated`)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
