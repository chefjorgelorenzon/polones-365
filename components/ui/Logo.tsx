export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-700 text-xl font-black text-white">
        MP
      </div>

      <div>
        <h1 className="text-xl font-black text-red-700">
          Márcio Polonês
        </h1>

        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Polonês 3.0
        </p>
      </div>
    </div>
  );
}