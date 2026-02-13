import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY || "";

export async function sendOrderNotification(orderDetails: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  size: string;
  framing: string;
  urgency: string;
  personCount: number;
}): Promise<void> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS not configured, skipping notification");
    return;
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        order_id: orderDetails.orderId,
        customer_name: orderDetails.customerName,
        customer_email: orderDetails.customerEmail,
        customer_phone: orderDetails.customerPhone,
        total_price: `₹${orderDetails.totalPrice}`,
        size: orderDetails.size,
        framing: orderDetails.framing,
        urgency: orderDetails.urgency,
        person_count: orderDetails.personCount.toString(),
      },
      PUBLIC_KEY
    );
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
}

export async function sendContactMessage(details: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  if (!SERVICE_ID || !PUBLIC_KEY) {
    console.warn("EmailJS not configured, skipping contact message");
    return;
  }

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: details.name,
        from_email: details.email,
        message: details.message,
      },
      PUBLIC_KEY
    );
  } catch (error) {
    console.error("Failed to send contact message:", error);
  }
}
