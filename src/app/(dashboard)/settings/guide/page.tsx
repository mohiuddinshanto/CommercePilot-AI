"use client";

import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tags,
  Warehouse,
  ShoppingCart,
  RotateCcw,
  Users,
  BarChart3,
  LineChart,
  Sparkles,
  Globe,
  Truck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface Section {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
}

const sections: Section[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    titleEn: "Dashboard",
    titleBn: "ড্যাশবোর্ড",
    contentEn:
      "Your central hub. View total sales, today's sales, weekly and monthly performance, product count, stock status, customer and staff numbers. Recent activity feed shows you what's happening in real time.",
    contentBn:
      "আপনার কেন্দ্রীয় হাব। মোট বিক্রয়, আজকের বিক্রয়, সাপ্তাহিক ও মাসিক পারফরম্যান্স, পণ্যের সংখ্যা, স্টকের অবস্থা, গ্রাহক ও স্টাফ সংখ্যা দেখুন। সাম্প্রতিক কার্যকলাপ ফিডে রিয়েল টাইমে কী happening দেখতে পাবেন।",
  },
  {
    id: "products",
    icon: Package,
    titleEn: "Products",
    titleBn: "পণ্য",
    contentEn:
      "Add, edit, and manage your products. Each product can have a name, SKU (auto-generated), category, description, cost price, selling price, discount price, tags, and image URL. Status can be Active, Draft, or Archived.",
    contentBn:
      "পণ্য যোগ, সম্পাদনা এবং পরিচালনা করুন। প্রতিটি পণ্যের নাম, SKU (অটো-জেনারেটেড), ক্যাটাগরি, বিবরণ, খরচ মূল্য, বিক্রয় মূল্য, ডিসকাউন্ট মূল্য, ট্যাগ এবং ইমেজ URL থাকতে পারে। স্ট্যাটাস Active, Draft বা Archived হতে পারে।",
  },
  {
    id: "categories",
    icon: Tags,
    titleEn: "Categories",
    titleBn: "ক্যাটাগরি",
    contentEn:
      "Organize your products into categories like Electronics, Clothing, etc. Categories help customers find products faster and make your reports more meaningful.",
    contentBn:
      "আপনার পণ্যগুলো ক্যাটাগরিতে সাজান — যেমন ইলেকট্রনিক্স, ক্লোদিং ইত্যাদি। ক্যাটাগরি গ্রাহকদের দ্রুত পণ্য খুঁজতে সাহায্য করে এবং রিপোর্ট আরও অর্থপূর্ণ করে।",
  },
  {
    id: "inventory",
    icon: Warehouse,
    titleEn: "Inventory",
    titleBn: "ইনভেনটরি",
    contentEn:
      "Track stock levels for every product. Set low stock alerts, view current, available, and reserved stock. Record stock movements — Stock In, Stock Out, or Adjustment. Cost price tracking helps calculate profit.",
    contentBn:
      "প্রতিটি পণ্যের স্টক লেভেল ট্র্যাক করুন। স্বল্প স্টক সতর্কতা সেট করুন, বর্তমান, উপলব্ধ এবং রিজার্ভ স্টক দেখুন। স্টক মুভমেন্ট রেকর্ড করুন — স্টক ইন, স্টক আউট বা অ্যাডজাস্টমেন্ট। খরচ মূল্য ট্র্যাকিং লাভ গণনা করতে সাহায্য করে।",
  },
  {
    id: "sales",
    icon: ShoppingCart,
    titleEn: "Sales",
    titleBn: "বিক্রয়",
    contentEn:
      "Create new sales with customer info, multiple items, discounts, and payment. Payment methods: Cash, bKash, Nagad, Rocket, Card, or Bank Transfer. Add optional payment notes (e.g., bKash transaction ID). Print invoices. Track payment status (Paid, Partial, Due).",
    contentBn:
      "গ্রাহক তথ্য, একাধিক আইটেম, ডিসকাউন্ট এবং পেমেন্টসহ নতুন বিক্রয় তৈরি করুন। পেমেন্ট পদ্ধতি: নগদ, বিকাশ, নগদ, রকেট, কার্ড বা ব্যাংক ট্রান্সফার। পেমেন্ট নোট যোগ করুন (যেমন: বিকাশ ট্রানজেকশন আইডি)। ইনভয়েস প্রিন্ট করুন। পেমেন্ট স্ট্যাটাস ট্র্যাক করুন (পরিশোধিত, আংশিক, বাকি)।",
  },
  {
    id: "returns",
    icon: RotateCcw,
    titleEn: "Returns",
    titleBn: "রিটার্ন",
    contentEn:
      "Handle product returns with three types: Refund (money back), Same Exchange (replace with same product), Different Exchange (replace with different product). On approval, sale amount auto-adjusts and stock is updated. Track return status: Pending → Approved → Completed.",
    contentBn:
      "তিন ধরণের রিটার্ন পরিচালনা করুন: রিফান্ড (টাকা ফেরত), সেম এক্সচেঞ্জ (একই পণ্য দিয়ে বদল), ডিফারেন্ট এক্সচেঞ্জ (ভিন্ন পণ্য দিয়ে বদল)। অনুমোদনে বিক্রয়ের পরিমাণ অটো-অ্যাডজাস্ট হয় এবং স্টক আপডেট হয়। রিটার্ন স্ট্যাটাস ট্র্যাক করুন: পেন্ডিং → অ্যাপ্রুভড → কমপ্লিটেড।",
  },
  {
    id: "shipments",
    icon: Truck,
    titleEn: "Shipments (Courier)",
    titleBn: "শিপমেন্ট (কুরিয়ার)",
    contentEn:
      "Send orders via courier directly from the sale detail page. Supports Steadfast, Pathao, RedX, eCourier, or Manual. Enter delivery address and phone, set COD amount. Track shipment status: Pending → Picked → In Transit → Delivered. On delivery, COD amount auto-adds to paid. On return/cancel, stock is auto-restored.",
    contentBn:
      "বিক্রয় ডিটেইল পৃষ্ঠা থেকে সরাসরি কুরিয়ারে অর্ডার পাঠান। Steadfast, Pathao, RedX, eCourier বা ম্যানুয়াল সাপোর্ট করে। ডেলিভারি ঠিকানা ও ফোন দিন, COD পরিমাণ সেট করুন। শিপমেন্ট স্ট্যাটাস ট্র্যাক করুন: পেন্ডিং → পিকড → ইন ট্রানজিট → ডেলিভারড। ডেলিভারিতে COD পরিমাণ অটো-পেমেন্টে যোগ হয়। রিটার্ন/ক্যান্সেলে স্টক অটো-রিস্টোর হয়।",
  },
  {
    id: "staff",
    icon: Users,
    titleEn: "Staff",
    titleBn: "স্টাফ",
    contentEn:
      "Invite staff members to help manage your store. Assign roles and permissions (Products, Categories, Inventory, Sales, Reports, etc.). Control what each staff member can access — perfect for delegating tasks securely.",
    contentBn:
      "স্টাফ সদস্যদের আমন্ত্রণ জানান আপনার স্টোর পরিচালনায় সাহায্য করতে। রোল এবং পারমিশন সেট করুন (পণ্য, ক্যাটাগরি, ইনভেনটরি, বিক্রয়, রিপোর্ট ইত্যাদি)। প্রতিটি স্টাফ কী অ্যাক্সেস করতে পারবে তা নিয়ন্ত্রণ করুন — নিরাপদে কাজ ভাগ করে দেওয়ার জন্য উপযুক্ত।",
  },
  {
    id: "reports",
    icon: BarChart3,
    titleEn: "Reports",
    titleBn: "রিপোর্ট",
    contentEn:
      "View detailed reports: Top Products, Top Categories, Top Customers, Best Cashiers, Sales by Payment Method, Low Stock & Dead Stock reports. Filter by date range or period (Today, This Week, This Month, etc.). All numbers in BDT.",
    contentBn:
      "বিস্তারিত রিপোর্ট দেখুন: সেরা পণ্য, সেরা ক্যাটাগরি, সেরা গ্রাহক, সেরা ক্যাশিয়ার, পেমেন্ট পদ্ধতি অনুযায়ী বিক্রয়, স্বল্প স্টক ও ডেড স্টক রিপোর্ট। তারিখ পরিসর বা পিরিয়ড অনুযায়ী ফিল্টার করুন (আজ, এই সপ্তাহ, এই মাস ইত্যাদি)। সব সংখ্যা BDT-তে।",
  },
  {
    id: "analytics",
    icon: LineChart,
    titleEn: "Analytics",
    titleBn: "অ্যানালাইটিক্স",
    contentEn:
      "Deep dive into your business metrics with interactive charts and visualizations. Track trends over time and make data-driven decisions.",
    contentBn:
      "ইন্টারঅ্যাকটিভ চার্ট ও ভিজুয়ালাইজেশনসহ আপনার ব্যবসার মেট্রিক্সের গভীর বিশ্লেষণ দেখুন। সময়ের সাথে ট্রেন্ড ট্র্যাক করুন এবং ডেটা-চালিত সিদ্ধান্ত নিন।",
  },
  {
    id: "ai",
    icon: Sparkles,
    titleEn: "AI Copilot",
    titleBn: "এআই কপাইলট",
    contentEn:
      "Chat with AI about your store data. Ask questions like 'What were my top products this month?' or 'Which customer spent the most?' The AI analyzes your data and gives instant answers. Also use AI Content Generator for product descriptions, social posts, and customer emails.",
    contentBn:
      "আপনার স্টোর ডেটা সম্পর্কে এআই-এর সাথে চ্যাট করুন। প্রশ্ন করুন যেমন 'এই মাসে আমার সেরা পণ্য কোনগুলো?' বা 'কোন গ্রাহক সবচেয়ে বেশি খরচ করেছে?' এআই আপনার ডেটা বিশ্লেষণ করে তাৎক্ষণিক উত্তর দেয়। এছাড়া এআই কন্টেন্ট জেনারেটর ব্যবহার করুন পণ্যের বিবরণ, সোশ্যাল পোস্ট এবং গ্রাহক ইমেইলের জন্য।",
  },
  {
    id: "language",
    icon: Globe,
    titleEn: "Language (বাংলা/English)",
    titleBn: "ভাষা (বাংলা/English)",
    contentEn:
      "Switch between English and Bengali anytime. Click the 'EN' or 'বাংলা' button in the top-right navbar. Your language preference is saved automatically.",
    contentBn:
      "যেকোনো সময় ইংরেজি ও বাংলার মধ্যে স্যুইচ করুন। উপরের ডান দিকের নেভবারে 'EN' বা 'বাংলা' বাটনে ক্লিক করুন। আপনার ভাষা পছন্দ অটোমেটিক সংরক্ষিত হয়।",
  },
];

export default function GuidePage() {
  const { lang } = useLanguage();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["dashboard", "products", "sales"]));

  const isBn = lang === "bn";

  const toggle = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isBn ? "ব্যবহারবিধি" : "User Guide"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isBn
            ? "CommercePilot AI ব্যবহার করার সম্পূর্ণ গাইড।"
            : "Complete guide to using CommercePilot AI."}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {isBn ? "স্বাগতম!" : "Welcome!"}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {isBn
              ? "CommercePilot AI তে আপনাকে স্বাগতম। নিচের গাইডটি আপনাকে প্রতিটি ফিচার বুঝতে সাহায্য করবে।"
              : "Welcome to CommercePilot AI. The guide below will help you understand each feature."}
          </p>
        </div>

        <div className="space-y-2">
          {sections.map((section) => {
            const isOpen = openSections.has(section.id);
            const Icon = section.icon;
            return (
              <div key={section.id} className="rounded-lg border border-gray-100">
                <button
                  onClick={() => toggle(section.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Icon className="h-5 w-5 text-blue-600 shrink-0" />
                  <span className="flex-1 text-sm font-medium text-gray-900">
                    {isBn ? section.titleBn : section.titleEn}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {isBn ? section.contentBn : section.contentEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-800">
            {isBn ? "প্রয়োজনে সাহায্য" : "Need Help?"}
          </h3>
          <p className="mt-1 text-sm text-blue-600">
            {isBn
              ? "ইমেইল: support@commercepilot.ai | ফোন: +880 1322 901105"
              : "Email: support@commercepilot.ai | Phone: +880 1322 901105"}
          </p>
        </div>
      </div>
    </div>
  );
}
