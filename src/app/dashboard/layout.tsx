
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Notifications from "./components/notifications";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 lg:mt-6">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-lg font-semibold">Waruiru Farm Dashboard</h1>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Overview
          </Link>
          <Link href="/dashboard/financials" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Financials
          </Link>
          <Link href="/dashboard/inventory" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Inventory
          </Link>
          <Link href="/dashboard/automation" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Automation
          </Link>
          <Link href="/dashboard/crop-analysis" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Crop Analysis
          </Link>
          <Notifications />
        </nav>

        {/* Mobile Dropdown Menu and Notifications */}
        <div className="md:hidden flex items-center space-x-2">
          <Notifications />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-green-100">
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Overview</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/financials">Financials</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/inventory">Inventory</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/automation">Automation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/crop-analysis">Crop Analysis</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
    </div>
  );
}
