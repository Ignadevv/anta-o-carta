export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  emoji: string;
  image?: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: "pollo-lena",
    title: "Pollo a la Leña",
    emoji: "🔥",
    image: "images/hero-chicken.jpg",
    items: [
      {
        id: "pl-1",
        name: "1 Pollo Entero a la Leña",
        description: "Papas, ensalada, gaseosa y cremas",
        price: 60.00,
        category: "pollo-lena",
      },
      {
        id: "pl-2",
        name: "1/2 de Pollo a la Leña",
        description: "Papas, ensalada y cremas",
        price: 33.00,
        category: "pollo-lena",
      },
      {
        id: "pl-3",
        name: "1/4 de Pollo a la Leña",
        description: "Papas, ensalada y cremas",
        price: 17.00,
        category: "pollo-lena",
      },
      {
        id: "pl-4",
        name: "1 Pollo y 1/4 a la Leña",
        description: "Papas, ensalada, gaseosa y cremas",
        price: 70.00,
        category: "pollo-lena",
      },
      {
        id: "pl-5",
        name: "1 Pollo y 1/2 a la Leña",
        description: "Papas, ensalada, gaseosa y cremas",
        price: 85.00,
        category: "pollo-lena",
      },
      {
        id: "pl-6",
        name: "Combo Chaufero",
        description: "1 pollo entero, arroz chaufa, papas, ensalada, gaseosa y cremas",
        price: 70.00,
        category: "pollo-lena",
      },
    ],
  },
  {
    id: "broaster",
    title: "Broaster",
    emoji: "🍗",
    image: "images/broaster.jpg",
    items: [
      {
        id: "br-1",
        name: "Broaster Pecho",
        description: "Pollo broaster + papas fritas + ensalada",
        price: 15.00,
        category: "broaster",
      },
      {
        id: "br-2",
        name: "Broaster Pierna",
        description: "Pollo broaster + papas fritas + ensalada",
        price: 14.00,
        category: "broaster",
      },
      {
        id: "br-3",
        name: "Broaster Encuentro",
        description: "Pollo broaster + papas fritas + ensalada",
        price: 14.00,
        category: "broaster",
      },
      {
        id: "br-4",
        name: "Broaster Ala",
        description: "Pollo broaster + papas fritas + ensalada",
        price: 12.00,
        category: "broaster",
      },
    ],
  },
  {
    id: "mostrito",
    title: "Mostrito",
    emoji: "💪",
    image: "images/mostro.jpg",
    items: [
      {
        id: "mt-1",
        name: "Mostrito Pecho",
        description: "Pollo broaster + papas fritas + arroz chaufa",
        price: 16.00,
        category: "mostrito",
      },
      {
        id: "mt-2",
        name: "Mostrito Pierna",
        description: "Pollo broaster + papas fritas + arroz chaufa",
        price: 16.00,
        category: "mostrito",
      },
      {
        id: "mt-3",
        name: "Mostrito Encuentro",
        description: "Pollo broaster + papas fritas + arroz chaufa",
        price: 16.00,
        category: "mostrito",
      },
      {
        id: "mt-4",
        name: "Mostrito Ala",
        description: "Pollo broaster + papas fritas + arroz chaufa",
        price: 14.00,
        category: "mostrito",
      },
    ],
  },
  {
    id: "mostro",
    title: "Mostro",
    emoji: "🦾",
    image: "images/combo.jpg",
    items: [
      {
        id: "mo-1",
        name: "Mostro Pecho",
        description: "1/4 pollo a la leña + papas fritas + arroz chaufa",
        price: 20.00,
        category: "mostro",
      },
      {
        id: "mo-2",
        name: "Mostro Pierna",
        description: "1/4 pollo a la leña + papas fritas + arroz chaufa",
        price: 19.00,
        category: "mostro",
      },
    ],
  },
];
