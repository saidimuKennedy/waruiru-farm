"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

interface DashboardSettingsProps {
  currentLayout: {
    showStats: boolean;
    showLowStockAlerts: boolean;
  };
  onSave: (newLayout: {
    showStats: boolean;
    showLowStockAlerts: boolean;
  }) => void;
}

/**
 * Dashboard Settings modal component.
 * Allows users to toggle visibility of stats cards and low stock alerts.
 */
export default function DashboardSettings({
  currentLayout,
  onSave,
}: DashboardSettingsProps) {
  const [layout, setLayout] = useState(currentLayout);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    onSave(layout);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showStats">Show Statistics Cards</Label>
            <Switch
              id="showStats"
              checked={layout.showStats}
              onCheckedChange={(checked) =>
                setLayout((prev) => ({ ...prev, showStats: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showLowStockAlerts">Show Low Stock Alerts</Label>
            <Switch
              id="showLowStockAlerts"
              checked={layout.showLowStockAlerts}
              onCheckedChange={(checked) =>
                setLayout((prev) => ({ ...prev, showLowStockAlerts: checked }))
              }
            />
          </div>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </DialogContent>
    </Dialog>
  );
}
