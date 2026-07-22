export default function CheckoutLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-3xl animate-pulse rounded-3xl border border-slate-200 bg-white p-8">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="mt-5 h-8 w-56 rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full max-w-lg rounded bg-slate-100" />

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="h-20 rounded-2xl bg-slate-100" />
          <div className="h-20 rounded-2xl bg-slate-100" />
        </div>

        <div className="mt-8 h-28 rounded-2xl bg-slate-100" />
        <div className="mt-8 h-14 rounded-2xl bg-slate-200" />
      </div>
    </main>
  );
}