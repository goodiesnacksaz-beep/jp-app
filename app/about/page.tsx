import Link from "next/link";
import { BookOpen, Target, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
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
                            className="px-4 py-2 text-blue-600 font-medium"
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
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        About KOTOBAnime
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Bridging the gap between anime entertainment and Japanese language learning
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <Target className="h-8 w-8 text-blue-600 mr-3" />
                            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            KOTOBAnime was created to solve a fundamental problem in language learning: 
                            the disconnect between traditional study methods and real-world usage. We believe 
                            that learning should be engaging, contextual, and connected to content you already 
                            love.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            By linking Japanese vocabulary directly to specific anime episodes, we provide 
                            learners with immediate context and motivation. Every word you study has meaning 
                            because you&apos;ve heard it in your favorite shows.
                        </p>
                    </div>

                    {/* Story Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <Sparkles className="h-8 w-8 text-purple-600 mr-3" />
                            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-4">
                            KOTOBAnime started from a simple observation: people who watch anime often want 
                            to learn Japanese, but traditional vocabulary lists feel dry and disconnected. 
                            We asked ourselves, &quot;What if vocabulary learning could be tied directly to 
                            the episodes people watch?&quot;
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            The result is a platform that transforms passive watching into active learning. 
                            After watching an episode, you can immediately test yourself on the vocabulary 
                            that appeared in it. This creates a powerful learning loop that combines 
                            entertainment with education.
                        </p>
                    </div>

                    {/* How It Works */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mr-4">
                                    <span className="text-blue-600 font-bold">1</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Watch Your Favorite Anime
                                    </h3>
                                    <p className="text-gray-700">
                                        Enjoy your anime as usual. We support popular series with episode-specific 
                                        vocabulary lists.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mr-4">
                                    <span className="text-blue-600 font-bold">2</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Take Episode Quizzes
                                    </h3>
                                    <p className="text-gray-700">
                                        After watching, test yourself on the vocabulary from that specific episode. 
                                        Choose from different quiz types to match your learning goals.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mr-4">
                                    <span className="text-blue-600 font-bold">3</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Get Immediate Feedback
                                    </h3>
                                    <p className="text-gray-700">
                                        Receive instant feedback on your answers with detailed explanations. 
                                        Learn from mistakes and reinforce correct knowledge.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 mr-4">
                                    <span className="text-blue-600 font-bold">4</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Track Your Progress
                                    </h3>
                                    <p className="text-gray-700">
                                        Monitor your learning journey with detailed statistics. See which episodes 
                                        you&apos;ve mastered and where you need more practice.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex items-center mb-4">
                            <Users className="h-8 w-8 text-green-600 mr-3" />
                            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Contextual Learning
                                </h3>
                                <p className="text-gray-700">
                                    Every word you learn has context from episodes you&apos;ve watched, 
                                    making retention easier and more natural.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    User-Friendly Design
                                </h3>
                                <p className="text-gray-700">
                                    Simple, intuitive interface that gets out of the way and lets you 
                                    focus on learning.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Continuous Improvement
                                </h3>
                                <p className="text-gray-700">
                                    We&apos;re constantly adding new anime, episodes, and features based 
                                    on user feedback.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Affordable Access
                                </h3>
                                <p className="text-gray-700">
                                    Free to use with optional one-time upgrade for ad-free experience. 
                                    No subscriptions required.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
                        <p className="text-xl mb-6 opacity-90">
                            Join thousands of anime fans learning Japanese the fun way
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/signup"
                                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                            >
                                Sign Up Free
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

