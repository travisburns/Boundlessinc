/** Optional design imagery/features per company slug, harvested from the mockups. */
export interface CompanyFeature {
  title: string;
  body: string;
  image: string;
}

export interface CompanyContent {
  aboutImage?: string;
  aboutParagraphs?: string[];
  features?: CompanyFeature[];
}

export const companyContent: Record<string, CompanyContent> = {
  firefin: {
    aboutImage: "/images/companies/firefin_about.png",
    aboutParagraphs: [
      "Firefin is a hospitality and consumer brand focused on memorable food, beverage, lifestyle, and guest experiences. We bring people together through thoughtful concepts, exceptional products, and a deep belief in the power of a shared table.",
      "From everyday moments to special occasions, Firefin creates experiences that nourish people and inspire a more connected, vibrant world.",
    ],
    features: [
      { title: "Food & Hospitality", body: "Restaurants, hospitality concepts, and culinary experiences built around exceptional food and service.", image: "/images/companies/firefin_food.png" },
      { title: "Consumer Products", body: "Food, beverage, and lifestyle products that extend our hospitality philosophy into everyday life.", image: "/images/companies/firefin_products.png" },
      { title: "Brand Experiences", body: "Immersive brand experiences, events, and spaces that connect people, culture, and community.", image: "/images/companies/firefin_restaurant.png" },
    ],
  },
};

const THUMBS: Record<string, string> = {
  boundless: "/images/companies/boundless.png",
  firefin: "/images/companies/firefin.png",
  skaffaldos: "/images/companies/skaffaldos.png",
  digitalheavyweights: "/images/companies/digitalheavyweights.png",
};

export function companyThumb(slug: string): string | undefined {
  return THUMBS[slug];
}
