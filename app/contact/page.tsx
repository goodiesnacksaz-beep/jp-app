import Link from "next/link";
import { BookOpen, Mail, MessageSquare, HelpCircle } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Navigation */}
            <nav className="border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">KOTOBAnime</span>
                    </Link>
                    <div className="flex space-x-4">
                        <Link
                            href="/about"
                            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="px-4 py-2 text-blue-600 font-medium"
                        >
                            Contact
                        </Link>
                        <Link
                            href="/login"
                            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Enter Site
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Get In Touch
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        We&apos;d love to hear from you. Whether you have questions, feedback, or suggestions.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="container mx-auto px-4 pb-16">
                <div className="max-w-4xl mx-auto">
                    {/* Main Contact Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex items-center justify-center mb-8">
                            <Mail className="h-16 w-16 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                            Email Us
                        </h2>
                        <p className="text-lg text-gray-700 text-center mb-6">
                            For any inquiries, support, or feedback, please reach out to us at:
                        </p>
                        <div className="text-center">
                            <a
                                href="mailto:support@kotobanime.com"
                                className="inline-flex items-center space-x-2 text-2xl font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <Mail className="h-6 w-6" />
                                <span>support@kotobanime.com</span>
                            </a>
                        </div>
                    </div>

                    {/* What to Contact Us About */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            What Can We Help You With?
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-100 rounded-lg p-3">
                                    <HelpCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        General Questions
                                    </h3>
                                    <p className="text-gray-700">
                                        Have questions about how KOTOBAnime works or how to get started? 
                                        We&apos;re here to help.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-green-100 rounded-lg p-3">
                                    <MessageSquare className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Feedback & Suggestions
                                    </h3>
                                    <p className="text-gray-700">
                                        We love hearing from our users! Share your ideas for new features 
                                        or improvements.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-purple-100 rounded-lg p-3">
                                    <BookOpen className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Content Requests
                                    </h3>
                                    <p className="text-gray-700">
                                        Want vocabulary for a specific anime or episode? Let us know what 
                                        you&apos;d like to see added.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-orange-100 rounded-lg p-3">
                                    <Mail className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Technical Support
                                    </h3>
                                    <p className="text-gray-700">
                                        Experiencing issues with the platform? Report bugs or technical 
                                        problems to us.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Response Time */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">
                            Response Time
                        </h3>
                        <p className="text-blue-800">
                            We typically respond to all inquiries within 24-48 hours during business days.
                        </p>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mt-8">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
                        <p className="text-xl mb-6 opacity-90">
                            Don&apos;t wait! Join KOTOBAnime today and start mastering Japanese vocabulary
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/dashboard"
                                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                            >
                                Start Learning
                            </Link>
                            <Link
                                href="/demo"
                                className="px-8 py-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors font-semibold border-2 border-white"
                            >
                                Try Demo Quiz
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-gray-50 mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">KOTOBAnime</span>
                        </div>
                        <div className="flex space-x-6">
                            <Link href="/about" className="text-gray-600 hover:text-blue-600">
                                About
                            </Link>
                            <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                                Contact
                            </Link>
                        </div>
                    </div>
                    <div className="text-center mt-4 text-gray-600 text-sm">
                        © {new Date().getFullYear()} KOTOBAnime. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

