import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <h1 className="text-6xl text-foreground font-bold">404</h1>
            <p className="text-xl mt-2">Oops! Page not found.</p>
            <Link 
                href="/" 
                className="mt-4 px-6 py-2 bg-background text-white rounded-lg hover:bg-foreground transition"
            >
                Go Home
            </Link>
        </div>
    );
}
