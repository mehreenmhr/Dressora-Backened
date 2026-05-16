<a name="readme-top"></a>

# ⚙️ Dressora Backend Architecture

The Dressora Backend is a robust, scalable REST API built to handle the complex data requirements of a multi-role e-commerce platform.

## 🛠 Built With

* **Node.js**
* **Express.js** (Web Framework)
* **MongoDB** (NoSQL Database)
* **Mongoose** (Object Data Modeling)
* **dotenv** (Environment Configuration)
* **cors** (Cross-Origin Resource Sharing)

## ✨ Core Features

* **JWT Authentication**: Secure user sessions with JSON Web Tokens and salted password hashing (bcrypt).
* **RESTful API Design**: Clean, predictable endpoint structures.
* **Mongoose Data Modeling**: Strict schema definitions with relationships (e.g., Products referencing Categories and Users).
* **Automated Data Seeding**: Built-in CLI commands to tear down and rebuild the database with realistic mock data.
* **Data Transformation**: Controller-level data formatting to bridge MongoDB architectures with frontend expectations.

## 🗄️ Database Schemas

* **User**: Manages customers, sellers, and administrators. Supports password hashing and role-based access.
* **Category**: Hierarchical product categorizations with icon support and seeder mapping.
* **Product**: Comprehensive details including stock, SKU, pricing, and category relationships.
* **Order**: (In Progress) tracking for items, shipping, and payment.

## 🚀 API Routes

### User & Auth
* `POST /api/users` - Register a new user
* `POST /api/users/login` - Authenticate user & get token
* `GET /api/users` - Get all users (Admin only)

### Products & Categories
* `GET /api/products` - Fetch all products (formatted for frontend)
* `GET /api/products/:id` - Fetch single product details
* `GET /api/categories` - Fetch all categories with icons

## 💻 CLI Commands

We provide utility scripts to manage your database state easily:

```bash
# Start the server in production mode
npm start

# Start the server in development mode (requires nodemon)
npm run dev

# Import initial seeder data into MongoDB
npm run data:import

# Destroy all data in the database (USE WITH CAUTION)
npm run data:destroy
```

## 🔒 Environment Configuration

Create a `.env` file in the root of the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>
