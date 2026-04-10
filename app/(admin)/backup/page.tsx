"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate, formatDateTime } from "@/lib/mock-api"
import {
  HardDrive, Download, Upload, RefreshCw, Clock, CheckCircle2,
  AlertCircle, Database, FileArchive, Cloud,
} from "lucide-react"
import { toast } from "sonner"

const backupHistory = [
  { id: 1, type: "Full Backup", size: "2.4 GB", status: "completed", createdAt: "2026-02-27T03:00:00Z", duration: "12 min" },
  { id: 2, type: "Incremental", size: "156 MB", status: "completed", createdAt: "2026-02-26T03:00:00Z", duration: "3 min" },
  { id: 3, type: "Incremental", size: "89 MB", status: "completed", createdAt: "2026-02-25T03:00:00Z", duration: "2 min" },
  { id: 4, type: "Full Backup", size: "2.3 GB", status: "completed", createdAt: "2026-02-20T03:00:00Z", duration: "11 min" },
  { id: 5, type: "Incremental", size: "234 MB", status: "failed", createdAt: "2026-02-19T03:00:00Z", duration: "N/A" },
]

const storageLocations = [
  { id: 1, name: "AWS S3", icon: Cloud, connected: true, usage: "15.6 GB", limit: "50 GB" },
  { id: 2, name: "Google Cloud", icon: Cloud, connected: false, usage: "0 GB", limit: "50 GB" },
  { id: 3, name: "Local Storage", icon: HardDrive, connected: true, usage: "8.2 GB", limit: "100 GB" },
]

export default function BackupPage() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [isBackingUp, setIsBackingUp] = useState(false)

  const handleBackupNow = () => {
    setIsBackingUp(true)
    toast.success("Backup started")
    setTimeout(() => {
      setIsBackingUp(false)
      toast.success("Backup completed successfully")
    }, 3000)
  }

  const totalStorage = 15.6 + 8.2
  const storageLimit = 150

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Backup & Recovery"
        description="Manage data backups and disaster recovery."
        breadcrumbs={[{ label: "Backup" }]}
        actions={
          <Button onClick={handleBackupNow} disabled={isBackingUp}>
            {isBackingUp ? (
              <>
                <RefreshCw className="mr-2 size-4 animate-spin" /> Backing up...
              </>
            ) : (
              <>
                <Database className="mr-2 size-4" /> Backup Now
              </>
            )}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Backup</p>
                <p className="text-lg font-bold text-foreground">Today 3:00 AM</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Backups</p>
                <p className="text-2xl font-bold text-foreground">{backupHistory.length}</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <FileArchive className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Storage Used</p>
                <p className="text-xl font-bold text-foreground">{totalStorage.toFixed(1)} GB</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                <HardDrive className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <Progress value={(totalStorage / storageLimit) * 100} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Backup</p>
                <p className="text-lg font-bold text-foreground">Tomorrow 3:00 AM</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Backup History</CardTitle>
            <CardDescription>View and manage your backup archive.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {backupHistory.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${
                        backup.status === "completed"
                          ? "bg-emerald-500/10"
                          : "bg-red-500/10"
                      }`}
                    >
                      {backup.status === "completed" ? (
                        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle className="size-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{backup.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(backup.createdAt)} &middot; {backup.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs">
                      {backup.size}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        disabled={backup.status === "failed"}
                        onClick={() => toast.info("Downloading backup...")}
                      >
                        <Download className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        disabled={backup.status === "failed"}
                        onClick={() => toast.info("Restoring from backup...")}
                      >
                        <Upload className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Backup Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-backup">Automatic Backups</Label>
                <Switch
                  id="auto-backup"
                  checked={autoBackup}
                  onCheckedChange={(v) => {
                    setAutoBackup(v)
                    toast.success(v ? "Auto backup enabled" : "Auto backup disabled")
                  }}
                />
              </div>
              {autoBackup && (
                <div className="flex flex-col gap-2">
                  <Label>Frequency</Label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Label htmlFor="incremental">Incremental Backups</Label>
                <Switch id="incremental" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="encryption">Encrypt Backups</Label>
                <Switch id="encryption" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Storage Locations</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {storageLocations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                      <location.icon className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{location.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {location.usage} / {location.limit}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={location.connected ? "default" : "secondary"}
                    className={`text-xs ${location.connected ? "bg-emerald-600" : ""}`}
                  >
                    {location.connected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
