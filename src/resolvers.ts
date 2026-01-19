import { DataSourceContext } from "./context";
import { validateFullAmenities } from "./helpers";
import { Resolvers } from "./types";
export const resolvers: Resolvers = {
  Query: {
    featuredListings: (_, __, { dataSources }: DataSourceContext) => {
      return dataSources.listingAPI.getFeaturedListings();
    },
    listing: (_, { id }, { dataSources }: DataSourceContext) => {
      return dataSources.listingAPI.getListing(id);
    },
  },
  Listing: {
    amenities: ({ id, amenities }, _, { dataSources }: DataSourceContext) => {
      return validateFullAmenities(amenities)
        ? amenities
        : dataSources.listingAPI.getAmenities(id);
    },
  },
  Mutation: {
    createListing: async (_, { input }, { dataSources }: DataSourceContext) => {
      try {
        const response = await dataSources.listingAPI.createListing(input);
        return {
          code: 200,
          success: true,
          message: "Listing successfully created!",
          listing: response,
        };
      } catch (err) {
        return {
          code: 500,
          success: false,
          message: `Something went wrong: ${err.extensions.response.body}`,
          listing: null,
        };
      }
    },
  },
};
