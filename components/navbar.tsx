"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, PenSquare, Home, Info } from "lucide-react"
import { usePathname } from "next/navigation"
import AdminDialog from "./admin-dialog"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white">
            Emotional Diary
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "text-white bg-primary/20" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            <Link
              href="/create"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/create") ? "text-white bg-primary/20" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Create Entry
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/about") ? "text-white bg-primary/20" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              About
            </Link>
            <AdminDialog />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden glass-card m-2 rounded-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              onClick={closeMenu}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive("/") ? "text-white bg-primary/20" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
            <Link
              href="/create"
              onClick={closeMenu}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive("/create") ? "text-white bg-primary/20" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <PenSquare className="h-5 w-5" />
              Create Entry
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive("/about") ? "text-white bg-primary/20" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Info className="h-5 w-5" />
              About
            </Link>
            <div className="pt-2">
              <AdminDialog isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
