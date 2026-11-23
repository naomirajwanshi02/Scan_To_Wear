// The one place that lists the wearables. Each wearable is its OWN project/repo and its own
// GitHub Pages site: edit and push it there and this hub opens the new version straight away
// (the hub only redirects to it, it holds no copy of the masks or the armour).
//
// `index` is the position of the picture inside targets.mind (tools/make-target.html builds
// it in this order). To add a wearable: add it here AND rebuild targets.mind.

const BASE = 'https://naomirajwanshi02.github.io/';

export const WEARABLES = [
  { index: 0, id: 'noh', name: 'Noh Masks', place: 'Wear a Noh mask',
    url: BASE + 'Noh_Masks/', picture: '../assets/noh-target.jpg' },
  { index: 1, id: 'samurai', name: 'Samurai Armour', place: 'Wear a samurai helmet',
    url: BASE + 'Samurai_Wear/', picture: BASE + 'Samurai_Wear/target.png' },
];

// ?demo=1 skips the wearable's own card scan, because the picture
// has already been recognised here.
export const openUrl = (w) => w.url + '?demo=1&from=hub';
