import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          PageSmith
        </h1>
        <p className="text-xl text-gray-900 dark:text-white">
          AI-Powered Ebook & Lead Magnet Generator
        </p>
        <p className="text-lg text-gray-900 dark:text-white">
          Create professional ebooks, lead magnets, and digital content with AI.
          <br />
          No design skills required.
        </p>
        <div className="pt-4">
          <Link
            href="/editor"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Creating
          </Link>
        </div>
      </div>
    </main>
  );
}
