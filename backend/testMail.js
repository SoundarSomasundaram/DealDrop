require("dotenv").config();
const { sendPriceDropEmail } = require("./services/emailService");

async function testEmail() {
  console.log("Testing Resend API...");
  
  const fakeProduct = {
    name: "Test Product - Sony WH-1000XM5",
    url: "https://example.com/product"
  };

  const success = await sendPriceDropEmail(
    "soundarsundaram2512@gmail.com", 
    fakeProduct, 
    399.99, 
    299.99
  );

  if (success) {
    console.log("Test email sent successfully!");
  } else {
    console.log("Test email failed to send.");
  }
}

testEmail();
