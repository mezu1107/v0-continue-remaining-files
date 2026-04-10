"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const pricingPlans = [
{
id:"1",
name:"Basic Website",
description:"Perfect for small businesses",
price_monthly:300,
price_yearly:2000,
features_monthly:[
"5 Page Professional Website",
"Mobile Responsive Design",
"Basic On-Page SEO",
"Contact Form Integration",
"Speed Optimization",
"1 Week Technical Support",
],
features_yearly:[
"Proper Management Agreement",
"Minimum Management 3 Months",
"Monthly Website Maintenance",
"Website Error Monitoring",
"Updates Added Monthly",
"Bugs And Errors Removed",
"Custom Support",
],
is_popular:false
},

{
id:"2",
name:"Startup Website",
description:"Perfect for startups",
price_monthly:600,
price_yearly:4500,
features_monthly:[
"8 Page Professional Website",
"Mobile Responsive Design",
"Advanced On-Page SEO",
"Lead Generation Forms",
"Speed Optimization",
"Google Analytics Setup",
"2 Weeks Technical Support",
],
features_yearly:[
"Professional Website Management Agreement",
"Minimum Management Duration 3 Months",
"Monthly Website Maintenance",
"Security Monitoring",
"Performance Optimization",
"Content Updates",
"Priority Support",
],
is_popular:true
},

{
id:"3",
name:"Premium Growth + Meta Ads",
description:"Full digital growth package",
price_monthly:4500,
price_yearly:18000,
features_monthly:[
"Unlimited Pages Website",
"Custom Web Application Features",
"Full SEO Optimization",
"Speed & Performance Optimization",
"CRM & Automation Integration",
"Priority Dedicated Support",
],
features_yearly:[
"Premium Digital Management Agreement",
"Minimum 3 Month Management Contract",
"Monthly Website Management",
"Advanced Feature Updates",
"Meta Ads Campaign Setup",
"Audience Targeting Strategy",
"Meta Ads Optimization",
"Monthly Marketing Reports",
"Dedicated Marketing Manager",
],
is_popular:false
}
]

export function PricingSection(){
const [isYearly,setIsYearly]=useState(false)

return(
<section className="py-24" id="pricing">
<div className="container mx-auto px-4">

<div className="text-center mb-12">
<h2 className="text-4xl font-bold mb-4">Transparent Pricing</h2>
<p className="text-muted-foreground">Choose the best package for your project</p>
</div>

{/* Toggle */}
<div className="flex items-center justify-center gap-4 mb-12">
<span className={!isYearly ? "font-semibold":"text-muted-foreground"}>Monthly</span>
<Switch checked={isYearly} onCheckedChange={setIsYearly}/>
<span className={isYearly ? "font-semibold":"text-muted-foreground"}>Yearly</span>
</div>

{/* Pricing Cards */}
<div className="grid md:grid-cols-3 gap-8">
{pricingPlans.map((plan)=>{
const price=isYearly?plan.price_yearly:plan.price_monthly
const features=isYearly?plan.features_yearly:plan.features_monthly

return(
<motion.div key={plan.id} initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} className={cn("rounded-xl p-8 border relative",plan.is_popular && "border-primary shadow-xl scale-105")}>
{plan.is_popular && (
<div className="absolute -top-4 left-1/2 -translate-x-1/2">
<span className="bg-primary text-white px-4 py-1 text-sm rounded-full flex items-center gap-1"><Sparkles size={14}/>Most Popular</span>
</div>
)}
<h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
<p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
<div className="text-4xl font-bold mb-6">${price}</div>
<ul className="space-y-3 mb-8">
{features.map((feature,i)=>(
<li key={i} className="flex gap-2 text-sm"><Check size={16} className="text-primary"/>{feature}</li>
))}
</ul>
<Link href="/contact"><Button className="w-full">Start Project</Button></Link>
</motion.div>
)
})}
</div>

</div>
</section>
)
}