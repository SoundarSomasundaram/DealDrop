const { supabase } = require("../utils/supabase");
const { scrapeProduct } = require("../services/firecrawlService");

async function addProduct(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const user = req.user; // from auth middleware

    const productData = await scrapeProduct(url);

    if (!productData.productName || !productData.currentPrice) {
      return res.status(400).json({ error: "Could not extract product information from this URL" });
    }

    const newPrice = parseFloat(productData.currentPrice);
    const currency = productData.currencyCode || "USD";

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("url", url)
      .single();

    const isUpdate = !!existingProduct;

    const { data: product, error } = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.id,
          url,
          name: productData.productName,
          current_price: newPrice,
          currency: currency,
          image_url: productData.productImageUrl,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,url",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) throw error;

    const shouldAddHistory = !isUpdate || existingProduct.current_price !== newPrice;

    if (shouldAddHistory) {
      await supabase.from("price_history").insert({
        product_id: product.id,
        price: newPrice,
        currency: currency,
      });
    }

    res.json({
      success: true,
      product,
      message: isUpdate ? "Product updated with latest price!" : "Product added successfully!",
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ error: error.message || "Failed to add product" });
  }
}

async function getProducts(req, res) {
  try {
    const user = req.user;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const user = req.user;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Ensure user owns the product

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getPriceHistory(req, res) {
  const { id } = req.params;
  try {
    const user = req.user;
    
    // Ensure user owns the product first
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", id)
      .order("checked_at", { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Get price history error:", error);
    res.status(500).json({ error: "Failed to get price history" });
  }
}

module.exports = { addProduct, getProducts, deleteProduct, getPriceHistory };
