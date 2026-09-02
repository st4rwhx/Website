import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-08-26.dahlia",
});

export const TRIAL_DAYS = Number(process.env.STRIPE_TRIAL_DAYS ?? 7);
