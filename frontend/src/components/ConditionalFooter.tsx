"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Define the route prefixes where the footer should be hidden
  const hideFooterRoutes = ["/business", "/student"];

  // Check if the current URL starts with any of the hidden routes
  const shouldHideFooter = hideFooterRoutes.some(route => pathname.startsWith(route));

  if (shouldHideFooter) {
    return null; // Render nothing on dashboard pages
  }

  // Render the standard footer on all other pages
  return <Footer />;
}