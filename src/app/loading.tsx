export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-dark-700" />
          <div className="absolute inset-0 rounded-full border-2 border-primary-400 border-t-transparent animate-spin" />
        </div>
        <p className="text-dark-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}
