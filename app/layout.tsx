import type {Metadata} from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'متجر Gold Clean | للمنظفات الفاخرة',
  description: 'متجر إلكتروني متكامل لأفخم وأجود أنواع منظفات المنزل والملابس والأطباق مع سلة تسوق زكية ودعم كامل لقاعدة بيانات Firebase.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} font-sans`}>
      <body className="bg-slate-50/50 text-slate-800 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
