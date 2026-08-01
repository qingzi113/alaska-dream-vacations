// Hostaway API client.
// Phase 1: falls back to mock data so the site builds and renders with no key.
// Phase 2: set HOSTAWAY_ACCOUNT_ID + HOSTAWAY_API_TOKEN in your environment (.env / Vercel)
// and this pulls live listings, photos, pricing, and availability.

const ACCOUNT_ID = import.meta.env.HOSTAWAY_ACCOUNT_ID;
const API_TOKEN = import.meta.env.HOSTAWAY_API_TOKEN;
const BASE = 'https://api.hostaway.com/v1';

export function hasLiveCredentials() {
  return Boolean(ACCOUNT_ID && API_TOKEN);
}

// Map a raw Hostaway listing object into the shape our components expect.
function mapListing(h) {
  const slug = String(h.externalListingName || h.name || h.id)
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    id: h.id,
    slug,
    name: h.name,
    location: [h.city, h.state].filter(Boolean).join(', ') || 'Fairbanks, AK',
    neighborhood: h.address || '',
    bedrooms: h.bedroomsNumber ?? null,
    guests: h.personCapacity ?? null,
    price: h.price ?? null,
    rating: h.starRating ?? null,
    reviewCount: h.reviewCount ?? null,
    photos: (h.listingImages || []).map((i) => i.url),
    amenities: (h.listingAmenities || []).map((a) => a.amenityName || a.name).filter(Boolean),
    description: h.description || '',
    // Airbnb / VRBO channel links if Hostaway exposes them; otherwise the page builds a search link.
    airbnb: h.airbnbListingUrl || h.airbnbUrl || null,
    vrbo: h.vrboListingUrl || h.homeawayUrl || null,
    scene: ['s1', 's2', 's3'][(h.id || 0) % 3],
  };
}

// Hostaway uses OAuth client-credentials: exchange Account ID + API key for a
// short-lived access token, then send that token as a Bearer on API calls.
let _token = null;
async function getAccessToken() {
  if (_token) return _token;
  const res = await fetch(`${BASE}/accessTokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: ACCOUNT_ID,
      client_secret: API_TOKEN, // this is the Hostaway API key (client secret)
      scope: 'general',
    }),
  });
  if (!res.ok) throw new Error(`Hostaway auth ${res.status}`);
  const json = await res.json();
  _token = json.access_token;
  return _token;
}

async function fetchLive(path) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'Cache-control': 'no-cache' },
  });
  if (!res.ok) throw new Error(`Hostaway ${res.status}`);
  const json = await res.json();
  return json.result;
}

export async function getListings() {
  if (hasLiveCredentials()) {
    try {
      const result = await fetchLive('/listings?limit=100');
      return result.map(mapListing);
    } catch (e) {
      console.warn('[hostaway] live fetch failed, using mock data:', e.message);
    }
  }
  const { MOCK_LISTINGS } = await import('../data/listings.js');
  return MOCK_LISTINGS;
}

export async function getListing(slug) {
  const all = await getListings();
  return all.find((l) => l.slug === slug) || null;
}
