// Where the store and its park stand in the frame, shared by the flat drawing
// and the 3D scene so they match. Shares of the frame height

// The store: this share of the frame, a little low
export const STORE_SCALE = 0.82;
// Gap under the store
export const STORE_BOTTOM = 0.04;
// Middle of the store, from the bottom of the frame
export const STORE_CENTER = STORE_BOTTOM + STORE_SCALE / 2;
// The park behind: as tall as the store and a bit more, centred on it, and
// whole (contain), as wide as its proportions make it
export const PARK_HEIGHT = STORE_SCALE * 1.2;
