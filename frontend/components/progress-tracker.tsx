type ProgressTrackerProps = {
  steps: string[];
  activeStep: number;
};

export function ProgressTracker({ steps, activeStep }: ProgressTrackerProps) {
  return (
    <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
      <div className="grid gap-6 md:grid-cols-4">
        {steps.map((step, index) => {
          const active = index <= activeStep;

          return (
            <div key={step} className="relative">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold ${
                    active
                      ? "border-gold bg-gold text-white"
                      : "border-cocoa/15 bg-cream text-cocoa/55"
                  }`}
                >
                  {index + 1}
                </div>
                <p className={`text-sm ${active ? "text-truffle" : "text-cocoa/60"}`}>{step}</p>
              </div>
              {index < steps.length - 1 ? (
                <div className="ml-6 mt-4 hidden h-0.5 w-[calc(100%-2rem)] bg-cocoa/10 md:block" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
