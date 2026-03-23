import { OrderTracker } from "@/components/order-tracker";

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8 rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-mocha">Order Tracking</p>
          <h1 className="mt-4 font-display text-5xl text-truffle">Track your cake in real time</h1>
          <p className="mt-4 text-base leading-8 text-cocoa/75">
            Enter your Order ID to check the progress of your sweet treats from our bakery to your doorstep.
          </p>
        </div>

        <OrderTracker />
      </div>
    </div>
  );
}
