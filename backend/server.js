const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const { connectDB, getCollection } = require('./db');

const PORT_VAL = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'cake-away-secret-key-123';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT_VAL}`;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!process.env.VERCEL && !fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Collection references
let Users, Orders, Reviews, Categories, Cakes;

const initialCategories = [
  {
    title: "Birthday Cakes",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=80",
    description: "Playful luxury cakes layered with whipped frosting and celebration sparkle."
  },
  {
    title: "Chocolate Cakes",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80",
    description: "Deep cocoa textures, silky ganache and artisan truffle finishes."
  },
  {
    title: "Wedding Cakes",
    image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=900&q=80",
    description: "Elegant tiered centrepieces with pearl tones and floral artistry."
  },
  {
    title: "Custom Cakes",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=900&q=80",
    description: "Designed around your story, flavour profile, palette and message."
  }
];

const initialCakes = [
  {
    slug: "rose-velvet-dream",
    name: "Rose Velvet Dream",
    price: 1299,
    rating: 4.9,
    flavour: "Red Velvet",
    type: "Birthday",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A signature red velvet sponge with mascarpone frosting, blush petals and edible gold flakes.",
    badge: "Chef's Pick"
  },
  {
    slug: "midnight-ganache",
    name: "Midnight Ganache",
    price: 1499,
    rating: 4.8,
    flavour: "Dark Chocolate",
    type: "Chocolate",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Three layers of dark chocolate sponge wrapped in glossy ganache and cocoa nib crunch."
  },
  {
    slug: "ivory-vows-tier",
    name: "Ivory Vows Tier",
    price: 6499,
    rating: 5,
    flavour: "Vanilla Bean",
    type: "Wedding",
    image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "A refined wedding cake featuring vanilla bean sponge, white chocolate mousse and sugar florals.",
    badge: "Bestseller"
  },
  {
    slug: "festival-pistachio-bloom",
    name: "Festival Pistachio Bloom",
    price: 1599,
    rating: 4.7,
    flavour: "Pistachio Rose",
    type: "Custom",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80"
    ],
    description: "Crunchy pistachio layers, delicate rosewater syrup and light whipped cream toppings."
  },
  {
    slug: "classic-red-velvet",
    name: "Classic Red Velvet",
    price: 999,
    rating: 4.8,
    flavour: "Red Velvet",
    type: "Birthday",
    image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1200&q=80"],
    description: "Traditional moist cocoa sponge with a vibrant red hue and vanilla cream cheese icing."
  },
  {
    slug: "truffle-indulgence",
    name: "Truffle Indulgence",
    price: 1199,
    rating: 4.9,
    flavour: "Chocolate",
    type: "Chocolate",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80"],
    description: "Multi-layered chocolate cake with rich truffle filling and artisan chocolate decorations."
  },
  {
    slug: "vanilla-bean-cloud",
    name: "Vanilla Bean Cloud",
    price: 899,
    rating: 4.7,
    flavour: "Vanilla",
    type: "Classic",
    image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=1200&q=80"],
    description: "Light and airy vanilla sponge infused with premium Madagascar vanilla beans."
  },
  {
    slug: "pistachio-praline-royal",
    name: "Pistachio Praline Royal",
    price: 1799,
    rating: 5.0,
    flavour: "Pistachio",
    type: "Luxury",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80"],
    description: "An exquisite creation with roasted pistachio praline and white chocolate mousse layers.",
    badge: "Limited Edition"
  },
  {
    slug: "black-beauty",
    name: "Black Beauty",
    price: 1399,
    rating: 4.9,
    flavour: "Dark Chocolate",
    type: "Chocolate",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80"],
    description: "Deep, mysterious and intensely chocolatey. A true gourmet experience."
  }
];

// Initialize DB and seeding
async function initializeDB() {
  try {
    await connectDB();
    Users = getCollection('users');
    Orders = getCollection('orders');
    Reviews = getCollection('reviews');
    Categories = getCollection('categories');
    Cakes = getCollection('cakes');

    const result = await Cakes.find().toArray();
    if (result.length === 0) {
      await Cakes.insertMany(initialCakes);
      console.log('Sample cakes seeded');
    } else {
      // Normalize existing images
      for (const cake of result) {
        let updated = false;
        if (cake.image && !cake.image.startsWith('http') && !cake.image.includes('unsplash')) {
           cake.image = `https://images.unsplash.com/${cake.image}?auto=format&fit=crop&w=1200&q=80`;
           updated = true;
        }
        // Fix broken freepik links (heuristic: if it's a freepik page instead of image)
        if (cake.image && cake.image.includes('freepik.com') && !cake.image.includes('.jpg') && !cake.image.includes('.png')) {
           cake.image = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80";
           updated = true;
        }
        // Specific fix for Black Beauty
        if (cake.slug === 'black-beauty' || cake.name.toLowerCase() === 'black beauty') {
           if (cake.image.includes('freepik')) {
             cake.image = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80";
             updated = true;
           }
        }
        if (updated) {
          await Cakes.updateOne({ _id: cake._id }, { $set: { image: cake.image } });
        }
      }
    }

    const catCount = await Categories.countDocuments();
    if (catCount === 0) {
      await Categories.insertMany(initialCategories);
      console.log("Categories seeded");
    }

    // Seed Admin User if not exists
    const adminEmail = 'admin@cakeaway.com';
    const adminExists = await Users.findOne({ email: adminEmail });
    if (!adminExists) {
      const salt = crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync('admin123', salt, 1000, 64, 'sha512').toString('hex');
      const adminUser = {
        id: 0,
        name: 'Admin',
        email: adminEmail,
        password: `${salt}:${hash}`
      };
      await Users.insertOne(adminUser);
      console.log("Admin user seeded: admin@cakeaway.com / admin123");
    }
  } catch (error) {
    console.error("DB Initialization Error:", error);
  }
}

// Validation Helpers
function validateCake(cake) {
  const errors = [];
  if (!cake.name) errors.push("Name is required");
  if (!cake.price || isNaN(cake.price)) errors.push("Valid price is required");
  if (!cake.flavour) errors.push("Flavour is required");
  if (!cake.type) errors.push("Type is required");
  return errors;
}

function validateOrder(order) {
  const errors = [];
  if (!order.customerName) errors.push("Customer name is required");
  if (!order.customerEmail) errors.push("Customer email is required");
  if (!order.address) errors.push("Address is required");
  if (!order.items || !order.items.length) errors.push("Order must have at least one item");
  return errors;
}

// Utility Helpers
function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify(data));
}

function sendError(res, status, message) {
  sendJSON(res, status, { error: message });
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      callback(null, JSON.parse(body));
    } catch (e) {
      callback(e);
    }
  });
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, hash] = storedPassword.split(':');
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === checkHash;
}

function createToken(payload) {
  // Simple isAdmin check
  if (payload.email === 'admin@cakeaway.com') {
    payload.isAdmin = true;
  }
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const base64Header = Buffer.from(header).toString('base64').replace(/=/g, "");
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, "");
  const signature = crypto.createHmac('sha256', SECRET_KEY)
    .update(`${base64Header}.${base64Payload}`)
    .digest('base64').replace(/=/g, "");
  return `${base64Header}.${base64Payload}.${signature}`;
}

function verifyToken(req) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  try {
    const [header, payload, sig] = token.split('.');
    const checkSig = crypto.createHmac('sha256', SECRET_KEY)
      .update(`${header}.${payload}`)
      .digest('base64').replace(/=/g, "");
    if (checkSig !== sig) return null;
    return JSON.parse(Buffer.from(payload, 'base64').toString());
  } catch (e) {
    return null;
  }
}

// API Handlers
async function handleCakes(req, res, pathname, query) {
  if (req.method === 'GET') {
    if (pathname === '/api/cakes') {
      const cakes = await Cakes.find().toArray();
      sendJSON(res, 200, { cakes });
    } else if (pathname === '/api/cakes/search') {
      const q = query.q ? query.q.toLowerCase() : '';
      const cakes = await Cakes.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { flavour: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }).toArray();
      sendJSON(res, 200, { cakes });
    } else if (pathname.startsWith('/api/cakes/')) {
      const slug = pathname.split('/api/cakes/')[1];
      const cake = await Cakes.findOne({ $or: [{ slug: slug }, { id: parseInt(slug) }] });
      if (cake) {
        sendJSON(res, 200, cake);
      } else {
        sendError(res, 404, 'Cake not found');
      }
    }
  } else if (req.method === 'POST' && pathname === '/api/cakes') {
    const user = verifyToken(req);
    if (!user || !user.isAdmin) return sendError(res, 403, 'Forbidden: Admin access required');
    
    parseBody(req, async (err, data) => {
      if (err) return sendError(res, 400, 'Invalid JSON');
      
      const valErrors = validateCake(data);
      if (valErrors.length > 0) return sendError(res, 400, valErrors.join(", "));
      
      const newCake = {
        ...data,
        id: Date.now(),
        rating: data.rating || 0,
        gallery: data.gallery || [data.image],
        slug: data.slug || (data.name ? data.name.toLowerCase().replace(/ /g, '-') : `cake-${Date.now()}`)
      };
      
      await Cakes.insertOne(newCake);
      sendJSON(res, 201, newCake);
    });
  } else if (req.method === 'DELETE' && pathname.startsWith('/api/cakes/')) {
    const user = verifyToken(req);
    if (!user || !user.isAdmin) return sendError(res, 403, 'Forbidden: Admin access required');
    
    const slug = pathname.split('/api/cakes/')[1];
    const result = await Cakes.deleteOne({ $or: [{ slug: slug }, { id: parseInt(slug) }] });
    if (result.deletedCount > 0) {
      sendJSON(res, 200, { message: 'Cake deleted' });
    } else {
      sendError(res, 404, 'Cake not found');
    }
  } else if (req.method === 'PUT' && pathname.startsWith('/api/cakes/')) {
    const user = verifyToken(req);
    if (!user || !user.isAdmin) return sendError(res, 403, 'Forbidden: Admin access required');
    
    const slug = pathname.split('/api/cakes/')[1];
    parseBody(req, async (err, data) => {
      if (err) return sendError(res, 400, 'Invalid JSON');
      
      const updatedCake = { ...data };
      if (updatedCake._id) delete updatedCake._id; // Ensure _id is not updated
      
      const result = await Cakes.updateOne(
        { $or: [{ slug: slug }, { id: parseInt(slug) }] },
        { $set: updatedCake }
      );
      
      if (result.matchedCount > 0) {
        sendJSON(res, 200, { message: 'Cake updated', cake: updatedCake });
      } else {
        sendError(res, 404, 'Cake not found');
      }
    });
  }
}

async function handleUpload(req, res) {
  const user = verifyToken(req);
  if (!user || !user.isAdmin) return sendError(res, 403, 'Forbidden: Admin access required');

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return sendError(res, 400, 'Upload error');
    
    let file = Array.isArray(files.image) ? files.image[0] : (files.image || files.file);
    if (!file) return sendError(res, 400, 'No image file uploaded');

    try {
      const result = await cloudinary.uploader.upload(file.filepath, {
        folder: 'cakeaway'
      });
      sendJSON(res, 200, { url: result.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      sendError(res, 500, 'Cloudinary upload failed');
    }
  });
}

function serveStatic(res, filepath) {
  const ext = path.extname(filepath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filepath, (err, data) => {
    if (err) return sendError(res, 404, 'File not found');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

async function handleOrders(req, res, pathname) {
  const user = verifyToken(req);
  if (req.method === 'GET') {
    if (pathname === '/api/orders') {
      if (!user) return sendError(res, 401, 'Unauthorized');
      const query = user.isAdmin ? {} : { customerEmail: user.email };
      const orders = await Orders.find(query).sort({ createdAt: -1 }).toArray();
      sendJSON(res, 200, { orders });
    } else if (pathname.startsWith('/api/orders/')) {
      const idStr = pathname.split('/api/orders/')[1];
      const order = await Orders.findOne({ id: parseInt(idStr) });
      if (order) sendJSON(res, 200, order);
      else sendError(res, 404, 'Order not found');
    }
  } else if (req.method === 'POST' && pathname === '/api/orders') {
    parseBody(req, async (err, data) => {
      if (err) return sendError(res, 400, 'Invalid JSON');
      
      const valErrors = validateOrder(data);
      if (valErrors.length > 0) return sendError(res, 400, valErrors.join(", "));

      const nextId = (await Orders.countDocuments()) + 1;
      const newOrder = { id: nextId, status: 'pending', createdAt: new Date().toISOString(), ...data };
      await Orders.insertOne(newOrder);
      sendJSON(res, 201, newOrder);
    });
  } else if (req.method === 'PUT' && pathname.startsWith('/api/orders/')) {
    const idStr = pathname.split('/api/orders/')[1];
    parseBody(req, async (err, data) => {
      if (err) return sendError(res, 400, 'Invalid JSON');
      const result = await Orders.findOneAndUpdate({ id: parseInt(idStr) }, { $set: data }, { returnDocument: 'after' });
      if (result) sendJSON(res, 200, result);
      else sendError(res, 404, 'Order not found');
    });
  } else if (req.method === 'DELETE' && pathname.startsWith('/api/orders/')) {
    const idStr = pathname.split('/api/orders/')[1];
    const result = await Orders.deleteOne({ id: parseInt(idStr) });
    if (result.deletedCount > 0) sendJSON(res, 200, { message: 'Order deleted' });
    else sendError(res, 404, 'Order not found');
  }
}

async function handleCategories(req, res) {
  const cats = await Categories.find().toArray();
  sendJSON(res, 200, { categories: cats });
}

async function handleAdminStats(req, res) {
  const user = verifyToken(req);
  if (!user || !user.isAdmin) return sendError(res, 403, 'Forbidden: Admin access required');
  const allOrders = await Orders.find().toArray();
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = allOrders.filter(o => o.status === 'pending').length;
  const cakeCount = await Cakes.countDocuments();
  const stats = [
    { label: "Total Orders", value: allOrders.length.toString(), note: `+${allOrders.length > 0 ? '100' : '0'}% this month` },
    { label: "Total Revenue", value: `Rs.${totalRevenue.toLocaleString()}`, note: `${allOrders.length} successful checkouts` },
    { label: "Pending Orders", value: pendingOrders.toString(), note: "Needs attention" },
    { label: "Active Cakes", value: cakeCount.toString(), note: "Available in menu" }
  ];
  sendJSON(res, 200, { stats });
}

async function handleAuth(req, res, pathname) {
  if (req.method === 'POST') {
    parseBody(req, async (err, data) => {
      if (err) return sendError(res, 400, 'Invalid JSON');
      if (pathname === '/api/auth/signup') {
        const existing = await Users.findOne({ email: data.email });
        if (existing) return sendError(res, 400, 'User already exists');
        const nextId = (await Users.countDocuments()) + 1;
        const newUser = { id: nextId, name: data.name, email: data.email, password: hashPassword(data.password) };
        await Users.insertOne(newUser);
        const { password, ...userWithoutPass } = newUser;
        const token = createToken({ id: newUser.id, email: newUser.email });
        sendJSON(res, 201, { token, user: userWithoutPass });
      } else if (pathname === '/api/auth/login') {
        const user = await Users.findOne({ email: data.email });
        if (!user || !verifyPassword(data.password, user.password)) return sendError(res, 401, 'Invalid email or password');
        const { password, ...userWithoutPass } = user;
        const token = createToken({ id: user.id, email: user.email });
        sendJSON(res, 200, { token, user: userWithoutPass });
      }
    });
  }
}

async function handleReviews(req, res, pathname, query) {
  if (req.method === 'GET') {
    const filter = query.cakeSlug ? { cakeSlug: query.cakeSlug } : {};
    const reviews = await Reviews.find(filter).sort({ date: -1 }).toArray();
    sendJSON(res, 200, reviews);
  } else if (req.method === 'POST') {
    parseBody(req, async (err, data) => {
      if (err) return sendError(res, 400, 'Invalid JSON');
      const newReview = { id: (await Reviews.countDocuments()) + 1, date: new Date().toISOString(), ...data };
      await Reviews.insertOne(newReview);
      sendJSON(res, 201, newReview);
    });
  }
}

function handleOptions(res) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  });
  res.end();
}

async function requestHandler(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  if (req.method === 'OPTIONS') return handleOptions(res);

  if (pathname.startsWith('/uploads/')) {
    const filename = pathname.split('/uploads/')[1];
    const filepath = path.join(UPLOADS_DIR, filename);
    return serveStatic(res, filepath);
  }

  if (pathname === '/api/upload' && req.method === 'POST') {
    return handleUpload(req, res);
  }

  if (pathname.startsWith('/api/cakes')) {
    await handleCakes(req, res, pathname, parsedUrl.query);
  } else if (pathname === '/api/categories') {
    await handleCategories(req, res);
  } else if (pathname.startsWith('/api/orders')) {
    await handleOrders(req, res, pathname);
  } else if (pathname.startsWith('/api/auth')) {
    await handleAuth(req, res, pathname);
  } else if (pathname === '/api/admin/stats') {
    await handleAdminStats(req, res);
  } else if (pathname.startsWith('/api/reviews')) {
    await handleReviews(req, res, pathname, parsedUrl.query);
  } else if (pathname === '/api/health') {
    sendJSON(res, 200, { status: 'ok', database: 'mongodb' });
  } else {
    sendError(res, 404, 'Route not found');
  }
}

// Serverless export for Vercel
module.exports = async (req, res) => {
  await initializeDB();
  return requestHandler(req, res);
};

// Local development listener
if (require.main === module) {
  const server = http.createServer(requestHandler);
  initializeDB().then(() => {
    server.listen(PORT_VAL, () => {
      console.log(`Cake Away Backend API running on port ${PORT_VAL} w/ MongoDB`);
    });
  });
}