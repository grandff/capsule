/**
 * Footer Component
 *
 * A responsive footer that displays copyright information and legal links.
 * This component appears at the bottom of every page in the application and
 * provides essential legal information and copyright notice.
 *
 * Features:
 * - Responsive design that adapts to different screen sizes
 * - Dynamic copyright year that automatically updates
 * - Links to legal pages (Privacy Policy, Terms of Service)
 * - View transitions for smooth navigation to legal pages
 * - Business information including company details and registration number
 */
import { Link } from "react-router";

/**
 * Footer component for displaying copyright information and legal links
 *
 * This component renders a responsive footer that adapts to different screen sizes.
 * On mobile, it displays the legal links above the copyright notice, while on desktop,
 * it displays them side by side with the copyright on the left and links on the right.
 * Business information is displayed below the copyright and legal links section.
 *
 * @returns A footer component with copyright information, legal links, and business details
 */
export default function Footer() {
  return (
    <footer className="text-muted-foreground mx-10 mt-auto flex flex-col border-t py-3 text-sm md:py-5">
      {/* Business information - displayed below copyright and legal links */}
      <div className="mx-auto w-full max-w-screen-2xl">
        <div className="text-muted-foreground/80 flex flex-col gap-2 text-xs">
          {/* First row: Company name, CEO, Privacy Officer */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <span className="font-medium">아진테크</span>
            <span>대표: 박명순</span>
            <span>개인정보책임관리자: 양수현</span>
          </div>

          {/* Second row: Business number, Address, Email */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <span>사업자번호: 417-69-00433</span>
            <span>주소: 광주 서구 풍서우로 450</span>
            <span>이메일: admin [@] capsule.diy</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4 flex h-full w-full max-w-screen-2xl flex-col items-center justify-between gap-2.5 md:order-none md:flex-row md:gap-0">
        {/* Copyright notice - appears second on mobile, first on desktop */}
        <div className="order-2 md:order-none">
          <p>
            &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}.
            All rights reserved.
          </p>
        </div>

        {/* Legal links - appears first on mobile, second on desktop */}
        <div className="order-1 flex gap-10 *:underline md:order-none">
          <Link to="/legal/privacy-policy" viewTransition>
            Privacy Policy
          </Link>
          <Link to="/legal/terms-of-service" viewTransition>
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
