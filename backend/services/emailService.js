const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendPriceDropEmail(toEmail, product, oldPrice, newPrice) {
  try {
    const { data, error } = await resend.emails.send({
      // Resend requires a verified domain. If you haven't verified a domain on Resend, 
      // you must use 'onboarding@resend.dev' as the "from" address and you can only send emails to yourself.
      from: "DealDrop Alerts <onboarding@resend.dev>", 
      to: toEmail,
      subject: `🚨 Price Drop Alert: ${product.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-w-md; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ea580c;">Good news! The price dropped!</h2>
          <p>The product you are tracking just went on sale.</p>
          
          <div style="padding: 15px; background: #fff7ed; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${product.name}</h3>
            <p style="margin: 5px 0; color: #4b5563;">Old Price: <del>$${oldPrice}</del></p>
            <p style="margin: 5px 0; color: #16a34a; font-size: 1.2em; font-weight: bold;">New Price: $${newPrice}</p>
          </div>

          <a href="${product.url}" style="display: inline-block; background: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Product</a>
          
          <p style="margin-top: 20px; font-size: 0.8em; color: #9ca3af;">
            You received this email because you are tracking this product on DealDrop.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return false;
    }

    console.log(`Email sent via Resend to ${toEmail}: ${data.id}`);
    return true;
  } catch (error) {
    console.error("Error sending email via Resend:", error);
    return false;
  }
}

module.exports = { sendPriceDropEmail };
