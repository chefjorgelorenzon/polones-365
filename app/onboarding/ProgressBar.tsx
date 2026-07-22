type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = Math.min(
    Math.max((currentStep / totalSteps) * 100, 0),
    100
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-red-700">
            Personalização
          </p>

          <p className="mt-1 text-sm font-semibold text-zinc-500">
            Etapa {currentStep} de {totalSteps}
          </p>
        </div>

        <span className="text-sm font-black text-zinc-700">
          {Math.round(progress)}%
        </span>
      </div>

      <div
        className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-200"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-valuenow={currentStep}
        aria-label={`Etapa ${currentStep} de ${totalSteps}`}
      >
        <div
          className="h-full rounded-full bg-red-700 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className={`h-1.5 rounded-full transition ${
                completed || active
                  ? "bg-red-700"
                  : "bg-zinc-200"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}