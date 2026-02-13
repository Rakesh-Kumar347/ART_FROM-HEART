import dbConnect from "./mongoose";
import PortfolioItem from "../models/PortfolioItem";
import PricingConfig from "../models/PricingConfig";
import Testimonial from "../models/Testimonial";
import { DEFAULT_PRICING } from "../constants";

const samplePortfolio = [
  {
    title: "Serene Portrait",
    description:
      "A delicate pencil portrait capturing the serene expression of a young woman.",
    category: "portraits",
    imageUrl: "/placeholder-portrait-1.jpg",
    thumbnailUrl: "/placeholder-portrait-1.jpg",
    size: "A4",
    timeTaken: "8 hours",
    isFeatured: true,
    displayOrder: 1,
  },
  {
    title: "Couple in Love",
    description:
      "A romantic pencil sketch of a couple sharing a tender moment together.",
    category: "couple",
    imageUrl: "/placeholder-couple-1.jpg",
    thumbnailUrl: "/placeholder-couple-1.jpg",
    size: "A3",
    timeTaken: "12 hours",
    isFeatured: true,
    displayOrder: 2,
  },
  {
    title: "Family Bond",
    description:
      "A heartwarming family portrait capturing the love between parents and their children.",
    category: "family",
    imageUrl: "/placeholder-family-1.jpg",
    thumbnailUrl: "/placeholder-family-1.jpg",
    size: "A3",
    timeTaken: "16 hours",
    isFeatured: true,
    displayOrder: 3,
  },
  {
    title: "Loyal Companion",
    description:
      "A detailed pencil sketch of a golden retriever with expressive eyes.",
    category: "pet_sketches",
    imageUrl: "/placeholder-pet-1.jpg",
    thumbnailUrl: "/placeholder-pet-1.jpg",
    size: "A4",
    timeTaken: "6 hours",
    isFeatured: true,
    displayOrder: 4,
  },
  {
    title: "Celebrity Tribute",
    description:
      "A stunning pencil portrait of a beloved celebrity with intricate detail.",
    category: "celebrity",
    imageUrl: "/placeholder-celebrity-1.jpg",
    thumbnailUrl: "/placeholder-celebrity-1.jpg",
    size: "A4",
    timeTaken: "10 hours",
    isFeatured: true,
    displayOrder: 5,
  },
  {
    title: "Custom Artwork",
    description:
      "A unique custom pencil sketch created from a special memory.",
    category: "custom",
    imageUrl: "/placeholder-custom-1.jpg",
    thumbnailUrl: "/placeholder-custom-1.jpg",
    size: "A3",
    timeTaken: "14 hours",
    isFeatured: true,
    displayOrder: 6,
  },
  {
    title: "Elegant Portrait",
    description:
      "A refined portrait showcasing detailed shading and expressive features.",
    category: "portraits",
    imageUrl: "/placeholder-portrait-2.jpg",
    thumbnailUrl: "/placeholder-portrait-2.jpg",
    size: "A4",
    timeTaken: "9 hours",
    isFeatured: false,
    displayOrder: 7,
  },
  {
    title: "Together Forever",
    description:
      "A beautifully detailed couple portrait with soft pencil strokes.",
    category: "couple",
    imageUrl: "/placeholder-couple-2.jpg",
    thumbnailUrl: "/placeholder-couple-2.jpg",
    size: "A4",
    timeTaken: "11 hours",
    isFeatured: false,
    displayOrder: 8,
  },
  {
    title: "Family Gathering",
    description:
      "A large family portrait capturing three generations in stunning detail.",
    category: "family",
    imageUrl: "/placeholder-family-2.jpg",
    thumbnailUrl: "/placeholder-family-2.jpg",
    size: "A2",
    timeTaken: "20 hours",
    isFeatured: false,
    displayOrder: 9,
  },
  {
    title: "Playful Kitten",
    description:
      "An adorable pencil sketch of a kitten mid-play with amazing fur detail.",
    category: "pet_sketches",
    imageUrl: "/placeholder-pet-2.jpg",
    thumbnailUrl: "/placeholder-pet-2.jpg",
    size: "A5",
    timeTaken: "5 hours",
    isFeatured: false,
    displayOrder: 10,
  },
];

const sampleTestimonials = [
  {
    customerName: "Priya Sharma",
    rating: 5,
    text: "Absolutely stunning work! The portrait of my parents captured their essence perfectly. Every detail was so lifelike.",
    isVisible: true,
  },
  {
    customerName: "Rahul Verma",
    rating: 5,
    text: "Got a couple portrait done for our anniversary. My wife was in tears of joy. The artist truly has a gift.",
    isVisible: true,
  },
  {
    customerName: "Anita Desai",
    rating: 5,
    text: "The pet sketch of my dog was incredible. He looked so real on paper! Fast delivery and great communication too.",
    isVisible: true,
  },
  {
    customerName: "Vikram Singh",
    rating: 4,
    text: "Great quality work and reasonable pricing. The AI pricing tool was surprisingly accurate. Will order again!",
    isVisible: true,
  },
];

const pricingConfigEntries = [
  {
    key: "basePrice",
    value: DEFAULT_PRICING.basePrice,
    description: "Base price for any sketch order",
  },
  {
    key: "complexityMultiplier",
    value: DEFAULT_PRICING.complexityMultiplier,
    description: "Price multiplier per complexity point",
  },
  {
    key: "personCharge",
    value: DEFAULT_PRICING.personCharge,
    description: "Additional charge per extra person beyond the first",
  },
  {
    key: "sizeFactors",
    value: DEFAULT_PRICING.sizeFactors,
    description: "Additional charges based on paper size",
  },
  {
    key: "framingFactors",
    value: DEFAULT_PRICING.framingFactors,
    description: "Additional charges for framing options",
  },
  {
    key: "urgencyFactors",
    value: DEFAULT_PRICING.urgencyFactors,
    description: "Additional charges for rush delivery",
  },
];

async function seed() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      PortfolioItem.deleteMany({}),
      PricingConfig.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);
    console.log("Cleared existing data");

    // Seed portfolio items
    await PortfolioItem.insertMany(samplePortfolio);
    console.log(`Seeded ${samplePortfolio.length} portfolio items`);

    // Seed pricing config
    await PricingConfig.insertMany(pricingConfigEntries);
    console.log(`Seeded ${pricingConfigEntries.length} pricing config entries`);

    // Seed testimonials
    await Testimonial.insertMany(sampleTestimonials);
    console.log(`Seeded ${sampleTestimonials.length} testimonials`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
