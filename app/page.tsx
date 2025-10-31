"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen, Brain, Sparkles, Trophy } from "lucide-react";

export default function HomePage() {
    useEffect(() => {
        // Initialize AdSense ads
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Navigation */}
            <nav className="border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">KOTOBAnime</span>
                    </div>
                    <div className="flex space-x-4">
                        <Link
                            href="/about"
                            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
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
                            href="/signup"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Learn Japanese Through
                    <span className="text-blue-600"> Anime</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Master Japanese vocabulary by taking interactive quizzes based on your
                    favorite anime episodes. Make learning fun and effective!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/signup"
                        className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Get Started Free
                    </Link>
                    <Link
                        href="/demo"
                        className="px-8 py-4 bg-purple-600 text-white text-lg rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                        Try Demo Quiz
                    </Link>
                    <Link
                        href="/login"
                        className="px-8 py-4 bg-white text-blue-600 text-lg rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                    >
                        Sign In
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                    Why Choose KOTOBAnime?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Episode-Based Learning
                        </h3>
                        <p className="text-gray-600">
                            Learn vocabulary from specific anime episodes. Practice with words you&apos;ve
                            actually heard in context.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <Brain className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Interactive Quizzes
                        </h3>
                        <p className="text-gray-600">
                            Test your knowledge with multiple quiz types. Get immediate feedback and
                            track your progress.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                        <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                            <Trophy className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            Track Your Progress
                        </h3>
                        <p className="text-gray-600">
                            Monitor your learning journey with detailed results and performance
                            statistics.
                        </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                        How It Works
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Choose Your Anime
                                </h3>
                                <p className="text-gray-600">
                                    Browse our collection of anime and select a season and episode you want
                                    to learn from.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Configure Your Quiz
                                </h3>
                                <p className="text-gray-600">
                                    Select quiz type (meaning, reading, or word recognition) and choose the
                                    number of questions.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Take the Quiz
                                </h3>
                                <p className="text-gray-600">
                                    Answer questions and get immediate feedback on each answer. Learn from
                                    your mistakes instantly.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                4
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Review Results
                                </h3>
                                <p className="text-gray-600">
                                    See your score and review all the vocabulary words, especially the ones
                                    you got wrong.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="bg-blue-600 rounded-2xl p-12 text-white">
                    <Sparkles className="h-16 w-16 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Start Learning?
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of learners mastering Japanese vocabulary through anime.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/signup"
                            className="inline-block px-8 py-4 bg-white text-blue-600 text-lg rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                        >
                            Sign Up Now - It&apos;s Free!
                        </Link>
                        <Link
                            href="/demo"
                            className="inline-block px-8 py-4 bg-purple-700 text-white text-lg rounded-lg hover:bg-purple-800 transition-colors font-semibold border-2 border-white"
                        >
                            Try Demo First
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">KOTOBAnime</span>
                        </div>
                        <div className="flex space-x-6 mb-4 md:mb-0">
                            <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                About
                            </Link>
                            <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                Contact
                            </Link>
                        </div>
                    </div>
                    <div className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} KOTOBAnime. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

