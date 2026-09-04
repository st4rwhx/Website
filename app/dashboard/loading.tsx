export default function DashboardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-48 rounded bg-black/10" />
      <div className="h-4 w-72 rounded bg-black/5" />
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="h-28 rounded-2xl bg-black/5" />
        <div className="h-28 rounded-2xl bg-black/5" />
      </div>
    </div>
  );
}
