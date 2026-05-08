const { supabase } = require("../utils/supabase");
const { scrapeProduct } = require("../services/firecrawlService");
const { sendPriceDropEmail } = require("../services/emailService");

async function runPriceCheckLogic() {
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*");

  if (productsError) throw productsError;

  console.log(`[CRON] Found ${products.length} products to check`);

  const results = {
    total: products.length,
    updated: 0,
    failed: 0,
    priceChanges: 0,
  };

  for (const product of products) {
    try {
      const productData = await scrapeProduct(product.url);

      if (!productData.currentPrice) {
        results.failed++;
        continue;
      }

      const newPrice = parseFloat(productData.currentPrice);
      const oldPrice = parseFloat(product.current_price);

      await supabase
        .from("products")
        .update({
          current_price: newPrice,
          currency: productData.currencyCode || product.currency,
          name: productData.productName || product.name,
          image_url: productData.productImageUrl || product.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (oldPrice !== newPrice) {
        await supabase.from("price_history").insert({
          product_id: product.id,
          price: newPrice,
          currency: productData.currencyCode || product.currency,
        });

        results.priceChanges++;

        // Send Email Alert if price dropped
        if (newPrice < oldPrice) {
          try {
            // Get user email using the service role key
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(product.user_id);
            if (userData?.user?.email && !userError) {
              await sendPriceDropEmail(userData.user.email, product, oldPrice, newPrice);
            }
          } catch (emailErr) {
            console.error(`Failed to send email for product ${product.id}`, emailErr);
          }
        }
      }

      results.updated++;
    } catch (error) {
      console.error(`Error processing product ${product.id}:`, error);
      results.failed++;
    }
  }

  return results;
}

async function checkPrices(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const results = await runPriceCheckLogic();

    return res.json({
      success: true,
      message: "Price check completed",
      results,
    });
  } catch (error) {
    console.error("Cron job API error:", error);
    return res.status(500).json({ error: error.message });
  }
}

function checkPricesStatus(req, res) {
  res.json({
    message: "Price check endpoint is working. Use POST to trigger.",
  });
}

module.exports = { checkPrices, checkPricesStatus, runPriceCheckLogic };
