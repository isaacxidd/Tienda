const API_URL = "https://fakestoreapi.com";

console.log(`
========================================
🧠  Bienvenido al Store Manager de TechLab
========================================
`);

const [, , method, resource, ...params] = process.argv;

async function getAllProducts() {
  const res = await fetch(`${API_URL}/products`);
  const products = await res.json();
  console.log("📦 Lista completa de productos:\n");
  console.table(
    products.map(p => ({
      ID: p.id,
      Nombre: p.title,
      Precio: `$${p.price}`,
      Categoría: p.category
    }))
  );
}

async function getProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`);
  const product = await res.json();
  if (!product || !product.id) {
    console.log(`⚠️ No se encontró el producto con ID ${id}`);
    return;
  }
  console.log("🧾 Producto encontrado:\n");
  console.log(product);
}

async function createProduct(title, price, category) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, price: parseFloat(price), category })
  });
  const data = await res.json();
  console.log("✅ Producto creado exitosamente:\n");
  console.log(data);
}

async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, { method: "DELETE" });
  const data = await res.json();
  console.log("🗑️ Producto eliminado:\n");
  console.log(data);
}

function showHelp() {
  console.log(`
🆘 Comandos disponibles:
----------------------------------------
  npm run start GET products
     → Muestra todos los productos
     
  npm run start GET products <id>
     → Muestra el producto con el ID indicado

  npm run start POST products <titulo> <precio> <categoria>
     → Crea un nuevo producto

  npm run start DELETE products/<id>
     → Elimina un producto específico
----------------------------------------
`);
}

async function main() {
  try {
    if (method === "GET" && resource === "products") {
      if (params[0]) await getProductById(params[0]);
      else await getAllProducts();
    } else if (method === "POST" && resource === "products") {
      const [title, price, category] = params;
      if (!title || !price || !category) {
        console.log("⚠️ Faltan argumentos. Ejemplo:");
        console.log("npm run start POST products 'Remera Tech' 2500 ropa");
        return;
      }
      await createProduct(title, price, category);
    } else if (method === "DELETE" && resource.startsWith("products/")) {
      const id = resource.split("/")[1];
      if (!id) {
        console.log("⚠️ Debes indicar un ID. Ejemplo:");
        console.log("npm run start DELETE products/3");
        return;
      }
      await deleteProduct(id);
    } else if (method === "HELP") {
      showHelp();
    } else {
      console.log("❌ Comando no reconocido. Usa:");
      console.log("npm run start HELP");
    }
  } catch (error) {
    console.error("🚨 Error en la ejecución:", error.message);
  }
}

main();
