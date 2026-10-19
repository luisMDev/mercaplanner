// Where the store and its park stand in the frame, shared by the flat drawing
// and the 3D scene so they match. Shares of the frame height; the store may
// reach over the top of the frame (the 3D canvas has room for it)

// The store: this share of the frame
export const STORE_SCALE = 0.94;
// Gap under the store, which stands a little high in its park
export const STORE_BOTTOM = 0.05;
// Middle of the store, from the bottom of the frame
export const STORE_CENTER = STORE_BOTTOM + STORE_SCALE / 2;
// The park behind: whole (contain), as wide as its proportions make it,
// centred a little under the middle of the frame
export const PARK_HEIGHT = 1.08;
export const PARK_CENTER = 0.45;
