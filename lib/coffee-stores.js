import { createApi } from "unsplash-js";

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls["small"]);
};

const getUrlForCoffeeStores = (ll, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${ll}&query=${query}&limit=${limit}`;
};

export const fetchCoffeeStores = async (
  ll = "55.704784,37.819437",
  limit = 8
) => {
  try {
    const photos = await getListOfCoffeeStorePhotos();
    const response = await fetch(
      getUrlForCoffeeStores(ll, "coffee stores", limit),
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
        },
      }
    );
    const data = await response.json();
    return (
      data.results?.map((venue, idx) => {
        const neighbourhood = venue.location.neighborhood;
        return {
          // ...venue,
          id: venue.fsq_id,
          address: venue.location.address || "",
          name: venue.name,
          neighbourhood:
            (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) ||
            venue.location.cross_street ||
            "",
          imgUrl: photos[idx],
        };
      }) || []
    );
  } catch (error) {
    if (
      !process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY ||
      !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    ) {
      console.error(
        "Make sure to setup your API keys, checkout the docs on Github"
      );
    }
    console.error("Something went wrong fetching coffee stores", error);
    return [];
  }
};
