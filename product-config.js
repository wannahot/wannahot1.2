// JEDYNE źródło danych o wariantach: cena (PLN), dostępność i adres oferty Allegro.
// Stany magazynowe są wpisywane ręcznie i NIE synchronizują się z Allegro ani Shopify.
// Aby zmienić cenę lub stan, edytuj tylko ten plik. allegroUrl: pełny adres oferty danej konfiguracji.
// image: opcjonalna ścieżka zdjęcia przypisanego do wariantu (np. "/img/1-stal-hot.jpg").
window.PRODUCT = {
  currency: "PLN",
  labels: {
    size: { "1": "1-osobowa", "2": "2-osobowa" },
    finish: { stal: "Stal klasyczna", drewno: "Drewno opalane" },
    type: { hot: "HOT TUB", cold: "COLD TUB" }
  },
  variants: [
    { id: "1-stal-hot",    size: "1", finish: "stal",   type: "hot",  price: 4990, stock: 10, image: "", allegroUrl: "" },
    { id: "1-stal-cold",   size: "1", finish: "stal",   type: "cold", price: 4590, stock: 10, image: "", allegroUrl: "" },
    { id: "1-drewno-hot",  size: "1", finish: "drewno", type: "hot",  price: 5490, stock: 10, image: "", allegroUrl: "" },
    { id: "1-drewno-cold", size: "1", finish: "drewno", type: "cold", price: 4990, stock: 10, image: "", allegroUrl: "" },
    { id: "2-stal-hot",    size: "2", finish: "stal",   type: "hot",  price: 5490, stock: 10, image: "", allegroUrl: "" },
    { id: "2-stal-cold",   size: "2", finish: "stal",   type: "cold", price: 4990, stock: 0,  image: "", allegroUrl: "" },
    { id: "2-drewno-hot",  size: "2", finish: "drewno", type: "hot",  price: 5990, stock: 10, image: "", allegroUrl: "" },
    { id: "2-drewno-cold", size: "2", finish: "drewno", type: "cold", price: 5490, stock: 10, image: "", allegroUrl: "" }
  ]
};
