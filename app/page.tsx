import { redirect } from "next/navigation";

export default function Page() {
  // Public landing page
  redirect("/Home"); 
}

export const metadata = {
  title: "Digital Agency Pakistan UK | Web Development & SEO - AM Enterprises Rawalpindi Islamabad",
  description: "AM Enterprises - Offices in Rawalpindi, Islamabad & UK. Expert web development, SaaS apps, SEO, digital marketing & graphic design by Moez Rehman. 500+ projects, 10+ countries. Grow your business today!",
  keywords: ["digital agency Rawalpindi", "web development Islamabad", "SEO services Pakistan UK", "Next.js developer Pakistan", "Moez Rehman", "digital marketing agency UK"],
  authors: [{ name: "Moez Rehman", url: "https://amenterprises.tech" }],
  openGraph: {
    title: "Digital Agency Pakistan UK | Web Dev & SEO - AM Enterprises",
    description: "Offices in Rawalpindi, Islamabad & UK. Custom websites, SaaS, SEO & lead generation by Moez Rehman.",
    images: [{ url: "https://amenterprises.tech/og-image.jpg" }],
    locale: "en_PK",
  },
  alternates: {
    canonical: "https://amenterprises.tech",
  },
  robots: {
    index: true,
    follow: true,
  },
};