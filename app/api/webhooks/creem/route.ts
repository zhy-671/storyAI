import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyCreemWebhookSignature } from "@/utils/creem/verify-signature";
import { CreemWebhookEvent } from "@/types/creem";
import {
  createOrUpdateCustomer,
  createOrUpdateSubscription,
  addCreditsToCustomer,
} from "@/utils/supabase/subscriptions";

const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const headersList = headers();
    const signature = (await headersList).get("creem-signature") || "";

    // Verify the webhook signature
    if (
      !signature ||
      !verifyCreemWebhookSignature(body, signature, CREEM_WEBHOOK_SECRET)
    ) {
      console.error("Invalid webhook signature");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body) as CreemWebhookEvent;
    console.log("Received webhook event:", event.eventType, event.object?.id);

    // Handle different event types
    switch (event.eventType) {
      case "checkout.completed":
        await handleCheckoutCompleted(event);
        break;
      case "subscription.active":
        await handleSubscriptionActive(event);
        break;
      case "subscription.paid":
        await handleSubscriptionPaid(event);
        break;
      case "subscription.canceled":
        await handleSubscriptionCanceled(event);
        break;
      case "subscription.expired":
        await handleSubscriptionExpired(event);
        break;
      case "subscription.trialing":
        await handleSubscriptionTrialing(event);
        break;
      default:
        console.log(
          `Unhandled event type: ${event.eventType} ${JSON.stringify(event)}`
        );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Return more specific error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Webhook processing failed", details: errorMessage },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(event: CreemWebhookEvent) {
  const checkout = event.object;
  console.log("Processing completed checkout:", JSON.stringify(checkout, null, 2));

  try {
    // Get user_id from checkout.metadata or checkout.order.metadata
    const userId = checkout.metadata?.user_id || checkout.order?.metadata?.user_id;
    if (!userId) {
      console.error("Missing user_id in checkout metadata:", checkout);
      throw new Error("user_id is required in checkout metadata");
    }

    // Get product_type from checkout.metadata or checkout.order.metadata
    const productType = checkout.metadata?.product_type || checkout.order?.metadata?.product_type;

    // Create or update customer
    const customerId = await createOrUpdateCustomer(
      checkout.customer,
      userId
    );
    console.log("Customer ID:", customerId);

    // Check if this is a credit purchase
    if (productType === "credits") {
      // Get credits from checkout.order.metadata or checkout.metadata
      // Convert to number in case it's a string
      const creditsRaw = checkout.order?.metadata?.credits || checkout.metadata?.credits;
      const credits = typeof creditsRaw === "string" ? parseInt(creditsRaw, 10) : Number(creditsRaw || 0);
      
      console.log("Processing credit purchase:", {
        creditsRaw,
        credits,
        orderId: checkout.order?.id,
      });

      if (!credits || credits <= 0) {
        console.error("Invalid credits amount:", creditsRaw);
        throw new Error(`Invalid credits amount: ${creditsRaw}`);
      }

      await addCreditsToCustomer(
        customerId,
        credits,
        checkout.order?.id,
        `Purchased ${credits} credits`
      );
      console.log("Successfully added credits to customer");
    }
    // If subscription exists, create or update it
    else if (checkout.subscription) {
      await createOrUpdateSubscription(checkout.subscription, customerId);
    }
  } catch (error) {
    console.error("Error handling checkout completed:", error);
    throw error;
  }
}

async function handleSubscriptionActive(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing active subscription:", subscription);

  try {
    // Create or update customer
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );

    // Create or update subscription
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription active:", error);
    throw error;
  }
}

async function handleSubscriptionPaid(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing paid subscription:", subscription);

  try {
    // Update subscription status and period
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription paid:", error);
    throw error;
  }
}

async function handleSubscriptionCanceled(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing canceled subscription:", subscription);

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription canceled:", error);
    throw error;
  }
}

async function handleSubscriptionExpired(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing expired subscription:", subscription);

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription expired:", error);
    throw error;
  }
}

async function handleSubscriptionTrialing(event: CreemWebhookEvent) {
  const subscription = event.object;
  console.log("Processing trialing subscription:", subscription);

  try {
    // Update subscription status
    const customerId = await createOrUpdateCustomer(
      subscription.customer as any,
      subscription.metadata?.user_id
    );
    await createOrUpdateSubscription(subscription, customerId);
  } catch (error) {
    console.error("Error handling subscription trialing:", error);
    throw error;
  }
}
