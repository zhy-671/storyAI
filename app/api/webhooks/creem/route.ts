import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { verifyCreemWebhookSignature } from "@/utils/creem/verify-signature";
import { CreemWebhookEvent } from "@/types/creem";
import {
  createOrUpdateCustomer,
  createOrUpdateSubscription,
  addCreditsToCustomer,
} from "@/utils/supabase/subscriptions";
import { createServiceRoleClient } from "@/utils/supabase/service-role";

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
      
      // Get product_id from metadata for bonus calculation
      const productId = checkout.order?.metadata?.product_id || checkout.metadata?.product_id;
      
      // Pro Pack (300 credits) and Creator Pack (1000 credits) get 10% bonus
      const PRO_PACK_PRODUCT_ID = "prod_3kgAMq0cFcKariXrvemDGJ";
      const CREATOR_PACK_PRODUCT_ID = "prod_2jSDE8g41GeKAJ8Dyis1dp";
      
      let bonusCredits = 0;
      let bonusDescription = "";
      
      if (productId === PRO_PACK_PRODUCT_ID || productId === CREATOR_PACK_PRODUCT_ID) {
        bonusCredits = Math.floor(credits * 0.1); // 10% bonus
        bonusDescription = ` + ${bonusCredits} bonus credits (10% bonus)`;
        console.log(`Premium pack purchase detected (${productId}), adding ${bonusCredits} bonus credits`);
      }
      
      console.log("Processing credit purchase:", {
        creditsRaw,
        credits,
        bonusCredits,
        totalCredits: credits + bonusCredits,
        productId,
        orderId: checkout.order?.id,
      });

      if (!credits || credits <= 0) {
        console.error("Invalid credits amount:", creditsRaw);
        throw new Error(`Invalid credits amount: ${creditsRaw}`);
      }

      // Add base credits
      await addCreditsToCustomer(
        customerId,
        credits,
        checkout.order?.id,
        `Purchased ${credits} credits${bonusDescription}`
      );
      
      // Add bonus credits if applicable
      if (bonusCredits > 0) {
        await addCreditsToCustomer(
          customerId,
          bonusCredits,
          checkout.order?.id,
          `Bonus credits: ${bonusCredits} (10% bonus for premium pack)`
        );
        console.log(`Successfully added ${bonusCredits} bonus credits to customer`);
      }
      
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

    // Get monthly credits from metadata
    const creditsRaw = subscription.metadata?.credits;
    const credits = typeof creditsRaw === "string" ? parseInt(creditsRaw, 10) : Number(creditsRaw || 0);

    if (credits > 0) {
      // Check if this is the first subscription (check if user has any previous subscription history)
      const supabase = createServiceRoleClient();
      const { data: existingSubs, error: checkError } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("customer_id", customerId)
        .neq("creem_subscription_id", subscription.id)
        .limit(1);

      const isFirstSubscription = !checkError && (!existingSubs || existingSubs.length === 0);

      // Add monthly credits
      await addCreditsToCustomer(
        customerId,
        credits,
        undefined,
        `Monthly subscription credits: ${credits}`
      );

      // Add first-time subscription bonus (20 credits)
      if (isFirstSubscription) {
        await addCreditsToCustomer(
          customerId,
          20,
          undefined,
          `First subscription bonus: 20 credits`
        );
        console.log(`Added first subscription bonus of 20 credits to customer ${customerId}`);
      }

      console.log(`Added ${credits} monthly subscription credits to customer ${customerId}`);
    }
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

    // Get monthly credits from metadata
    const creditsRaw = subscription.metadata?.credits;
    const credits = typeof creditsRaw === "string" ? parseInt(creditsRaw, 10) : Number(creditsRaw || 0);

    if (credits > 0) {
      // Add monthly credits for renewal
      await addCreditsToCustomer(
        customerId,
        credits,
        undefined,
        `Monthly subscription renewal: ${credits} credits`
      );
      console.log(`Added ${credits} monthly subscription renewal credits to customer ${customerId}`);
    }
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
