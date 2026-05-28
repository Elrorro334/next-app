import DataFetcher from "./components/DataFetcher";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8">
      <main className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-4">
          API Data Fetching
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          This is a simple Next.js application that fetches data from an API.
        </p>
        <DataFetcher />
      </main>
    </div>
  );
}
