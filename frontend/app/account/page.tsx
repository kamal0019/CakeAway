"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  items: any[];
  total: number;
  deliveryDate: string;
  deliveryTime: string;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchUserOrders();
    } else {
      router.push("/auth/login");
    }
    setLoading(false);
  }, [router]);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      } else {
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const userOrders = allOrders.filter((order: Order) => order.customerEmail === storedUser.email);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userOrders = allOrders.filter((order: Order) => order.customerEmail === storedUser.email);
      setOrders(userOrders);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("userUpdated"));
    router.push("/");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p>Please log in to view your account.</p>
          <a href="/auth/login" className="text-truffle hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-mocha">User Account</p>
          <h1 className="mt-4 font-display text-5xl text-truffle">Welcome, {user.name}</h1>
          <div className="mt-8 space-y-4">
            <div className="rounded-[1rem] bg-cream px-4 py-3 text-sm">
              <strong>Email:</strong> {user.email}
            </div>
            <div className="rounded-[1rem] bg-cream px-4 py-3 text-sm">
              <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <button
              onClick={handleLogout}
              className="w-full rounded-full bg-cocoa px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-cream transition hover:bg-truffle"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
            <p className="font-display text-3xl text-truffle">Order History</p>
            <div className="mt-5 space-y-3">
              {orders.length === 0 ? (
                <p className="text-sm text-cocoa/75">No orders yet. <a href="/cakes" className="text-truffle hover:underline">Browse cakes</a></p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="rounded-[1rem] bg-cream p-4 text-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">Order #{order.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-cocoa/75 mb-1">Items: {order.items.map(item => item.name).join(", ")}</p>
                    <p className="text-cocoa/75 mb-1">Total: Rs.{order.total}</p>
                    <p className="text-cocoa/75">Delivery: {order.deliveryDate} at {order.deliveryTime}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
              <p className="font-display text-3xl text-truffle">Quick Actions</p>
              <div className="mt-5 space-y-3">
                <a href="/cakes" className="block rounded-[1rem] bg-cream px-4 py-3 text-sm text-cocoa/75 hover:bg-cocoa hover:text-cream transition">
                  Browse Cakes
                </a>
                <a href="/custom-cake" className="block rounded-[1rem] bg-cream px-4 py-3 text-sm text-cocoa/75 hover:bg-cocoa hover:text-cream transition">
                  Custom Cake
                </a>
                <a href="/track-order" className="block rounded-[1rem] bg-cream px-4 py-3 text-sm text-cocoa/75 hover:bg-cocoa hover:text-cream transition">
                  Track Order
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
              <p className="font-display text-3xl text-truffle">Preferences</p>
              <div className="mt-5 space-y-3 text-sm leading-7 text-cocoa/75">
                <p className="rounded-[1rem] bg-cream px-4 py-3">Email notifications enabled</p>
                <p className="rounded-[1rem] bg-cream px-4 py-3">SMS updates for orders</p>
                <p className="rounded-[1rem] bg-cream px-4 py-3">Birthday reminders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
