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
  address: string;
  customMessage?: string;
}

interface Cake {
  id: number;
  name: string;
  price: number;
  description: string;
  flavour: string;
  type: string;
  image: string;
  gallery: string[];
  slug: string;
  rating: number;
  badge?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isAddingCake, setIsAddingCake] = useState(false);
  const [newCake, setNewCake] = useState({
    name: "",
    price: "",
    description: "",
    flavour: "",
    type: "Birthday",
    image: "",
    badge: ""
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editingCake, setEditingCake] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
    fetchCakes();
    fetchStats();
    setLoading(false);
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      } else if (res.status === 403 || res.status === 401) {
        setError("Unauthorized: Admin access required.");
      } else {
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0);
        setStats([
          { label: "Total Orders (Local)", value: orders.length, note: "Items in browser storage" },
          { label: "Estimated Revenue", value: `Rs.${totalRevenue}`, note: "Based on local orders" },
          { label: "Pending locally", value: orders.filter((o: any) => o.status === "pending").length, note: "Action required" }
        ]);
      }
    } catch (error) {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      setStats([
          { label: "Total Orders (Local)", value: orders.length, note: "Items in browser storage" }
      ]);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      } else {
        setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
      }
    } catch (error) {
      setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
    }
  };

  const fetchCakes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cakes`);
      if (res.ok) {
        const data = await res.json();
        setCakes(data.cakes);
      } else {
        // We'll just define some cakes here if API fails
        setCakes([
          { id: 1, name: "Rose Velvet Dream", price: 1299, description: "Signature red velvet", flavour: "Red Velvet", type: "Classic", image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d", gallery: [], slug: "rose-velvet-dream", rating: 5 },
          { id: 2, name: "Midnight Ganache", price: 1499, description: "Dark chocolate", flavour: "Chocolate", type: "Chocolate", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c", gallery: [], slug: "midnight-ganache", rating: 4 }
        ]);
      }
    } catch (error) {
        setCakes([
            { id: 1, name: "Rose Velvet Dream", price: 1299, description: "Signature red velvet", flavour: "Red Velvet", type: "Classic", image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d", slug: "rose-velvet-dream", gallery: [], rating: 5 }
        ]);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          fetchOrders();
        }
      } catch (error) {
        console.error("Failed to delete order:", error);
      }
    }
  };

  const deleteCake = async (cakeSlug: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/cakes/${cakeSlug}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCakes();
      } else {
        const data = await res.json();
        alert(`Delete failed: ${data.error || 'Server error'}`);
      }
    } catch (error) {
      console.error("Failed to delete cake:", error);
    }
  };

  const startEditing = (cake: any) => {
    setEditingCake(cake);
    setNewCake({
      name: cake.name,
      price: cake.price.toString(),
      description: cake.description,
      flavour: cake.flavour,
      type: cake.type,
      image: cake.image,
      badge: cake.badge || ""
    });
    setPreviewUrl(cake.image.startsWith('http') ? cake.image : `https://images.unsplash.com/${cake.image}?auto=format&fit=crop&w=600&q=80`);
    setIsAddingCake(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddCake = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      let imageUrl = newCake.image;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const uploadRes = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        } else {
          alert("Image upload failed");
          return;
        }
      }

      const url = editingCake 
        ? `${API_BASE_URL}/api/cakes/${editingCake.slug}`
        : `${API_BASE_URL}/api/cakes`;
      
      const method = editingCake ? "PUT" : "POST";
      console.log(`Saving cake: ${method} ${url}`, newCake);

      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...newCake,
          image: imageUrl,
          price: parseInt(newCake.price)
        })
      });
      if (res.ok) {
        setIsAddingCake(false);
        setEditingCake(null);
        setNewCake({ name: "", price: "", description: "", flavour: "", type: "Birthday", image: "", badge: "" });
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchCakes();
      } else {
        const data = await res.json();
        alert(`Error: ${data.message || data.error || 'Operation failed'}`);
      }
    } catch (error) {
      console.error("Failed to save cake:", error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">Loading admin panel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-red-200 bg-red-50 p-12 text-center text-red-800">
          <h1 className="font-display text-4xl mb-4">Access Denied</h1>
          <p>{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="mt-6 rounded-full bg-red-800 px-6 py-2 text-sm text-white"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-truffle">Admin Dashboard</h1>
        <p className="mt-2 text-cocoa/75">Manage orders and cakes</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
            <p className="text-xs uppercase tracking-wider text-cocoa/60">{stat.label}</p>
            <p className="mt-1 font-display text-2xl text-truffle">{stat.value}</p>
            <p className="mt-1 text-xs text-mocha">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              activeTab === "orders"
                ? "bg-cocoa text-cream"
                : "bg-cream text-cocoa hover:bg-cocoa/10"
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("cakes")}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              activeTab === "cakes"
                ? "bg-cocoa text-cream"
                : "bg-cream text-cocoa hover:bg-cocoa/10"
            }`}
          >
            Cakes ({cakes.length})
          </button>
        </div>
      </div>

      {activeTab === "orders" && (
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
          <h2 className="font-display text-2xl text-truffle mb-6">Order Management</h2>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-cocoa/75">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border border-cocoa/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-cocoa/75">{order.customerName} - {order.customerEmail}</p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-sm border border-cocoa/10 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-cocoa/75">
                    <p>Items: {order.items.map(item => `${item.name} (x${item.quantity})`).join(", ")}</p>
                    <p>Total: Rs.{order.total}</p>
                    <p>Delivery: {order.deliveryDate} at {order.deliveryTime}</p>
                    <p>Address: {order.address}</p>
                    {order.customMessage && <p>Message: {order.customMessage}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "cakes" && (
        <div className="rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-3xl text-truffle">
              {editingCake ? `Edit: ${editingCake.name}` : "Add New Cake"}
            </h2>
            <button 
              onClick={() => {
                setIsAddingCake(false);
                setEditingCake(null);
                setNewCake({ name: "", price: "", description: "", flavour: "", type: "Birthday", image: "", badge: "" });
                setPreviewUrl(null);
              }}
              className="text-mocha hover:text-truffle"
            >
              ✕ Cancel
            </button>
          </div>

          {isAddingCake && (
            <form onSubmit={handleAddCake} className="mb-8 grid gap-4 p-6 border border-cocoa/10 rounded-2xl bg-cream/30">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Cake Name"
                  required
                  className="rounded-xl border border-cocoa/10 p-3 text-sm focus:outline-mocha"
                  value={newCake.name}
                  onChange={(e) => setNewCake({ ...newCake, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price (Rs.)"
                  required
                  className="rounded-xl border border-cocoa/10 p-3 text-sm focus:outline-mocha"
                  value={newCake.price}
                  onChange={(e) => setNewCake({ ...newCake, price: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Flavour"
                  required
                  className="rounded-xl border border-cocoa/10 p-3 text-sm focus:outline-mocha"
                  value={newCake.flavour}
                  onChange={(e) => setNewCake({ ...newCake, flavour: e.target.value })}
                />
                <select
                  className="rounded-xl border border-cocoa/10 p-3 text-sm focus:outline-mocha"
                  value={newCake.type}
                  onChange={(e) => setNewCake({ ...newCake, type: e.target.value })}
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Custom">Custom</option>
                  <option value="Classic">Classic</option>
                </select>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="rounded-xl border border-cocoa/10 p-2 text-sm focus:outline-mocha file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cocoa file:text-cream hover:file:bg-truffle"
                />
                <div className="text-center text-xs text-cocoa/50">OR</div>
                <input
                  type="text"
                  placeholder="Or Paste Image URL"
                  className="rounded-xl border border-cocoa/10 p-3 text-sm focus:outline-mocha"
                  value={newCake.image}
                  onChange={(e) => {
                    setNewCake({ ...newCake, image: e.target.value });
                    setSelectedFile(null);
                    setPreviewUrl(e.target.value.startsWith('http') ? e.target.value : null);
                  }}
                />
              </div>

              {previewUrl && (
                <div className="relative h-40 w-full overflow-hidden rounded-xl border border-cocoa/10">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); setNewCake({...newCake, image: ""}); }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs"
                  >
                    ✕
                  </button>
                </div>
              )}

              <textarea
                placeholder="Description"
                required
                rows={3}
                className="rounded-xl border border-cocoa/10 p-3 text-sm focus:outline-mocha"
                value={newCake.description}
                onChange={(e) => setNewCake({ ...newCake, description: e.target.value })}
              />
              <button
                type="submit"
                className="rounded-xl bg-truffle py-3 font-semibold text-cream hover:bg-cocoa transition-colors"
              >
                {editingCake ? "Update Cake" : "List Cake"}
              </button>
            </form>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cakes.map((cake) => (
              <div key={cake.slug} className="border border-cocoa/10 rounded-lg p-4 group relative">
                {cake.image && (
                  <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                     <img 
                      src={cake.image.startsWith('http') ? cake.image : `https://images.unsplash.com/${cake.image}?auto=format&fit=crop&w=600&q=80`} 
                      alt={cake.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <h3 className="font-semibold">{cake.name}</h3>
                <p className="text-sm text-cocoa/75 mb-2">{cake.flavour}</p>
                <div className="flex justify-between items-center">
                <div className="flex justify-between items-center mt-auto">
                  <p className="font-display text-lg text-truffle">Rs.{cake.price}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => startEditing(cake)}
                      className="text-mocha hover:text-truffle text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCake(cake.slug)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
