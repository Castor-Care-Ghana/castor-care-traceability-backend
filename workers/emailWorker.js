import amqplib from "amqplib";
import { mailTransporter } from "../utils/mail.js";

const startEmailWorker = async () => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue("emailQueue");
    console.log("📨 Email worker running...");

    channel.consume("emailQueue", async (msg) => {
      if (msg !== null) {
        const emailData = JSON.parse(msg.content.toString());
        try {
          await mailTransporter.sendMail(emailData);
          console.log("✅ Email sent to:", emailData.to);
        } catch (err) {
          console.error("❌ Failed to send email:", err);
        }
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("❌ Email worker error:", error);
  }
};

startEmailWorker();
