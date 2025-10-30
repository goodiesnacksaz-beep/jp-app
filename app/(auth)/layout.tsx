import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
            {/* Navigation */}
            <nav className="border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">KOTOBAnime</span>
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                {children}
            </div>
        </div>
    );
}

