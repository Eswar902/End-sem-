# Crave — Food Delivery Menu App

A responsive food menu and cart application built with HTML, CSS, JavaScript, Vite and JSON Server.

## Requirements
- Node.js 18 or later
- npm

## Run the application
1. Extract the ZIP file.
2. Open the extracted `food-delivery-menu` folder in VS Code.
3. Open the terminal in that folder.
4. Install packages:
   ```bash
   npm install
   ```
5. Start the frontend and JSON Server together:
   ```bash
   npm run dev
   ```
6. Open the Vite URL shown in the terminal (usually http://localhost:5173).

JSON Server API runs at **http://localhost:3000**.
- `GET http://localhost:3000/dishes` — list all dishes
- `GET http://localhost:3000/dishes/1` — get one dish

## Features
- Menu data is loaded dynamically from `db.json` using Fetch API.
- Category filters and live dish search.
- Responsive food cards with price, rating and preparation time.
- Add items, increase/decrease quantities and calculate cart total.
- Demo checkout (no payment gateway or real order submission).

## Customize
Edit `db.json` to add, remove or update dishes. Keep each dish's `id` unique. The page fetches the data from JSON Server when it loads.

## Project structure
```
food-delivery-menu/
├── index.html
├── style.css
├── src.js
├── db.json
├── package.json
└── README.md
```

Note: The menu images are loaded from Unsplash and therefore require an internet connection.
