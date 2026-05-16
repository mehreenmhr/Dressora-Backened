const categories = [
  { mockId: 1, name: 'Modest', description: 'Modest fashion styles', icon: '👗' },
  { mockId: 2, name: 'Eastern', description: 'Eastern wear collection', icon: '🥻' },
  { mockId: 3, name: 'Western', description: 'Western fashion styles', icon: '👔' },
];

const users = [
  { firstName: 'Admin', lastName: 'User', email: 'admin@dressora.com', password: 'password123', phoneNumber: '0321-5555555', userType: 'admin', isActive: true },
  { firstName: 'Seller', lastName: 'One', email: 'seller@dressora.com', password: 'password123', phoneNumber: '0311-9876543', userType: 'seller', isActive: true },
  { firstName: 'Fatima', lastName: 'Khan', email: 'customer@dressora.com', password: 'password123', phoneNumber: '0300-1234567', userType: 'customer', isActive: true },
];

const products = [
  { mockId: 1, name: 'Cream Green 2 Piece', description: 'Elegant cream and green 2-piece eastern suit.', price: 3500, stockQuantity: 45, sku: 'DRS-FLR-001', category: 2, isActive: true, rating: 4.7, reviewCount: 23, discount: 15, image: '/assets/Eastern/cream-green-2-piece.jpeg' },
  { mockId: 2, name: 'Cream Green Garden', description: 'Beautiful floral themed eastern wear.', price: 4200, stockQuantity: 12, sku: 'DRS-VLT-002', category: 2, isActive: true, rating: 4.9, reviewCount: 41, discount: 0, image: '/assets/Eastern/cream-green-garden.jpeg' },
  { mockId: 4, name: 'Mini Black Frock Shirt', description: 'Elegant mini black frock shirt for a modern look.', price: 2200, stockQuantity: 60, sku: 'WST-FRK-004', category: 3, isActive: true, rating: 4.5, reviewCount: 32, discount: 0, image: '/assets/Western/mini-black-frock-shirt.jpeg' },
  { mockId: 5, name: 'Brownish Cord Set', description: 'Comfortable and stylish brownish cord set.', price: 2800, stockQuantity: 55, sku: 'WST-CRD-005', category: 3, isActive: true, rating: 4.6, reviewCount: 28, discount: 20, image: '/assets/Western/brownish-cord-set.webp' },
  { mockId: 7, name: 'Grey Embroidery 3 Piece', description: 'Sophisticated grey 3-piece suit with intricate embroidery.', price: 5200, stockQuantity: 40, sku: 'ACC-BAG-007', category: 2, isActive: true, rating: 4.4, reviewCount: 11, discount: 25, image: '/assets/Eastern/grey-embroidery-3-piece.jpeg' },
  { mockId: 8, name: 'Lilac Skin Shirt', description: 'Stylish lilac shirt with premium fabric.', price: 2800, stockQuantity: 25, sku: 'DRS-BOH-008', category: 2, isActive: true, rating: 4.6, reviewCount: 36, discount: 0, image: '/assets/Eastern/lilac-skin-shirt.jpeg' },
  { mockId: 10, name: 'Mehroon T-Shirt with Pants', description: 'Casual mehroon t-shirt paired with comfortable pants.', price: 1200, stockQuantity: 100, sku: 'WST-SET-010', category: 3, isActive: true, rating: 4.9, reviewCount: 67, discount: 0, image: '/assets/Western/mehroon-tshirt-pants.webp' },
  { mockId: 11, name: 'Garden Tree Set', description: 'Trendy garden tree set with stylish design.', price: 1900, stockQuantity: 50, sku: 'WST-SHT-011', category: 3, isActive: true, rating: 4.2, reviewCount: 9, discount: 0, image: '/assets/Western/garden-tree-set.avif' },
  { mockId: 12, name: 'Orange Pretty 3 Piece', description: 'Vibrant orange 3-piece eastern outfit.', price: 4900, stockQuantity: 35, sku: 'DRS-PST-012', category: 2, isActive: true, rating: 4.5, reviewCount: 18, discount: 10, image: '/assets/Eastern/orange-pretty-3-piece.jpeg' },
  { mockId: 101, name: 'Black and White Cut Abaya', description: 'Elegant black and white cut abaya', price: 4500, stockQuantity: 50, sku: 'MOD-001', category: 1, isActive: true, rating: 4.8, reviewCount: 28, discount: 15, image: '/assets/Modest/black-white-cut-abaya.jpeg' },
  { mockId: 102, name: 'Black Umbrella Abaya', description: 'Classic black umbrella style abaya', price: 5200, stockQuantity: 50, sku: 'MOD-002', category: 1, isActive: true, rating: 4.7, reviewCount: 19, discount: 0, image: '/assets/Modest/black-umbrella-abaya.jpeg' },
  { mockId: 103, name: 'Blue Open Cut Abaya', description: 'Beautiful blue open cut abaya', price: 4800, stockQuantity: 50, sku: 'MOD-003', category: 1, isActive: true, rating: 4.9, reviewCount: 35, discount: 10, image: '/assets/Modest/blue-open-cut-abaya.jpeg' },
  { mockId: 104, name: 'Modest Navy Frok Abaya', description: 'Navy frock style modest abaya', price: 5000, stockQuantity: 50, sku: 'MOD-004', category: 1, isActive: true, rating: 4.6, reviewCount: 22, discount: 20, image: '/assets/Modest/modest-navy-frock-abaya.jpeg' },
  { mockId: 105, name: 'Modest Open Cut Abaya', description: 'Stylish open cut modest abaya', price: 4700, stockQuantity: 50, sku: 'MOD-005', category: 1, isActive: true, rating: 4.8, reviewCount: 31, discount: 0, image: '/assets/Modest/modest-open-cut-abaya.jpeg' },
  { mockId: 106, name: 'Pink Floral Abaya', description: 'Pink floral printed modest abaya', price: 4900, stockQuantity: 50, sku: 'MOD-006', category: 1, isActive: true, rating: 4.9, reviewCount: 42, discount: 15, image: '/assets/Modest/pink-floral-abaya.jpeg' },
  { mockId: 107, name: 'Pastel Green', description: 'Refreshing pastel green eastern wear.', price: 3800, stockQuantity: 10, sku: 'EST-001', category: 2, isActive: true, rating: 5.0, reviewCount: 12, discount: 5, image: '/assets/Eastern/pastel-green.jpeg' },
  { mockId: 108, name: 'Purplish With Pink Embroider', description: 'Elegant purplish suit with pink embroidery.', price: 5500, stockQuantity: 15, sku: 'EST-002', category: 2, isActive: true, rating: 4.8, reviewCount: 8, discount: 0, image: '/assets/Eastern/purplish-pink-embroider.jpeg' },
  { mockId: 109, name: 'Sky Embroidery Dream', description: 'Dreamy sky blue embroidered suit.', price: 6200, stockQuantity: 5, sku: 'EST-003', category: 2, isActive: true, rating: 4.9, reviewCount: 14, discount: 10, image: '/assets/Eastern/sky-embroidery-dream.jpeg' },
  { mockId: 110, name: 'White Cotton Fairy', description: 'Pure white cotton fairy-style eastern wear.', price: 4500, stockQuantity: 3, sku: 'EST-004', category: 2, isActive: true, rating: 5.0, reviewCount: 5, discount: 0, image: '/assets/Eastern/white-cotton-fairy.jpeg' },
  { mockId: 112, name: 'Blackish Green Pant Shirt', description: 'Stylish blackish green pant shirt for a modern look.', price: 2100, stockQuantity: 30, sku: 'WST-SHT-112', category: 3, isActive: true, rating: 4.4, reviewCount: 15, discount: 0, image: '/assets/Western/blackish-green-pant-shirt.webp' },
  { mockId: 113, name: 'Lilac Spring Combo', description: 'Beautiful lilac spring combo outfit perfect for the season.', price: 3200, stockQuantity: 20, sku: 'WST-SET-113', category: 3, isActive: true, rating: 4.7, reviewCount: 8, discount: 5, image: '/assets/Western/lilac-spring-combo.webp' },
];

module.exports = { categories, users, products };
