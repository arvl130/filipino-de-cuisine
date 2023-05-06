import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.menuItem.deleteMany()
  await prisma.menuItem.createMany({
    data: [
      // Main Dish
      {
        id: 1,
        name: "Plain Rice",
        description:
          "Plain rice is a staple food partnered with every Filipino dishes.",
        category: "Main Dish",
        price: 15.0,
        imgUrl: "https://i.imgur.com/IhFpKtk.png",
        isActive: true,
      },
      {
        id: 2,
        name: "Fried Rice",
        description:
          "Plain rice is a staple food partnered with every Filipino dishes.",
        category: "Main Dish",
        price: 15.0,
        imgUrl: "https://i.imgur.com/6pWXycz.png",
        isActive: true,
      },
      {
        id: 3,
        name: "Pineapple Chicken",
        description:
          "Pineapple Chicken is a chicken dish cooked in pineapple and coconut milk",
        category: "Main Dish",
        price: 70.0,
        imgUrl: "https://i.imgur.com/yD4bJRB.png",
        isActive: true,
      },
      {
        id: 4,
        name: "Pineapple Chicken",
        description:
          "Tocilog is a popular Filipino breakfast dish that consists of tocino (sweet cured pork), sinangag (garlic fried rice), and itlog (fried egg). The name 'tocilog' is a combination of the three main components of the dish.",
        category: "Main Dish",
        price: 100.0,
        imgUrl: "https://i.imgur.com/NAuXuRC.png",
        isActive: true,
      },
      {
        id: 5,
        name: "Tapsilog",
        description:
          "Tapsilog is a dish made with marinated beef, garlic fried rice, and a fried egg.",
        category: "Main Dish",
        price: 110.0,
        imgUrl: "https://i.imgur.com/XlEwYcG.png",
        isActive: true,
      },
      {
        id: 6,
        name: "Pork Kare-Kare",
        description:
          "Pork Kare-kare is a traditional stew that is made with oxtail, tripe, and vegetables cooked in a rich and savory peanut sauce.",
        category: "Main Dish",
        price: 80.0,
        imgUrl: "https://i.imgur.com/PbjlDWT.png",
        isActive: true,
      },
      {
        id: 7,
        name: "Sizzling Pork",
        description:
          "Sizzling Pork is a popular Filipino dish made with chopped pig's head and liver, flavored with calamansi, onions, and chili peppers, and served on a sizzling plate.",
        category: "Main Dish",
        price: 80.0,
        imgUrl: "https://i.imgur.com/5aoBI18.png",
        isActive: true,
      },
      {
        id: 8,
        name: "Crispy Pata",
        description:
          "Crispy pata is a pork-lover's delight crunchy pork skin enclosing savory tender meat. Crispy pata is usually defined as deep-fried pork trotters or knuckles.",
        category: "Main Dish",
        price: 80.0,
        imgUrl: "https://i.imgur.com/qTaO9It.png",
        isActive: true,
      },
      // Dessert
      {
        id: 9,
        name: "Halo-Halo",
        description:
          "Halo-halo Is a popular dessert that consists of a mixture of shaved ice and various sweet ingredients.",
        category: "Dessert",
        price: 60.0,
        imgUrl: "https://i.imgur.com/tBsW2lI.png",
        isActive: true,
      },
      {
        id: 10,
        name: "Puto Chesse",
        description:
          "Puto Cheese is a Filipino steamed rice cake, this puto cheese have sweet and salty flavour as sugar gives it sweet taste and Cheese gives it salty taste and soft look.Puto Cheese is a Filipino steamed rice cake, this puto cheese have sweet and salty flavour as sugar gives it sweet taste and Cheese gives it salty taste and soft look.",
        category: "Dessert",
        price: 50.0,
        imgUrl: "https://i.imgur.com/4dKE5xD.png",
        isActive: true,
      },
      {
        id: 11,
        name: "Leche Flan",
        description:
          "Leche flan is a popular dessert that Is similar to caramel custard or creme caramel.",
        category: "Dessert",
        price: 90.0,
        imgUrl: "https://i.imgur.com/SVoQvM4.png",
        isActive: true,
      },
      {
        id: 12,
        name: "Brazo De Mercedes",
        description:
          "Crispy Dilis is a snack made from small anchovies that are deep-fried until crispy. It is often served with vinegar and garlic dip or eaten as is as a crunchy and salty snack,",
        category: "Dessert",
        price: 90.0,
        imgUrl: "https://i.imgur.com/FSgyhRd.png",
        isActive: true,
      },
      {
        id: 13,
        name: "Puto Kutsinta",
        description:
          "Puto Kutsinta is a dessert made with steamed rice cakes flavored with brown sugar and lye water.",
        category: "Dessert",
        price: 50.0,
        imgUrl: "https://i.imgur.com/qdRP480.png",
        isActive: true,
      },
      {
        id: 14,
        name: "Buko Pie",
        description:
          "Buko pie is a Filipino-style coconut pie made of fresh, tender young coconut meat combined with a creamy filing and enclosed in a flaky pie crust.",
        category: "Dessert",
        price: 80.0,
        imgUrl: "https://i.imgur.com/4k9SN6B.png",
        isActive: true,
      },
      {
        id: 15,
        name: "Ube Halaya",
        description:
          "Ube halaya is a dessert made with ube, coconut milk, and condensed milk.",
        category: "Dessert",
        price: 90.0,
        imgUrl: "https://i.imgur.com/C4DediI.png",
        isActive: true,
      },
      {
        id: 16,
        name: "Mango Float",
        description:
          "Mango Float is a dessert made with layers of whipped cream, graham crackers, and sliced ripe mangoes.",
        category: "Dessert",
        price: 90.0,
        imgUrl: "https://i.imgur.com/S9TWmwQ.png",
        isActive: true,
      },
      // Drinks
      {
        id: 17,
        name: "Coconut Juice",
        description:
          "Coconut Juice is a refreshing and nutritious drink that comes from the inside of a young green coconut.",
        category: "Drinks",
        price: 70.0,
        imgUrl: "https://i.imgur.com/hwJT3jW.png",
        isActive: true,
      },
      {
        id: 18,
        name: "Coca-Cola",
        description:
          "Coca Cola is made from a syrup of sugar, caramel coloring, caffeine, phosphoric acid, natural flavors, and carbonated water.",
        category: "Drinks",
        price: 60.0,
        imgUrl: "https://i.imgur.com/zLKcv6a.png",
        isActive: true,
      },
      {
        id: 19,
        name: "Lemon Soda",
        description:
          "Lemon soda is a blend of lemon juice with icecubes, salt, sugar and chilled soda.",
        category: "Drinks",
        price: 70.0,
        imgUrl: "https://i.imgur.com/69rpVdB.png",
        isActive: true,
      },
      {
        id: 20,
        name: "Watermelon Juice",
        description:
          "Watermelon juice is a refreshing and hydrating drink that is perfect for hot weather.",
        category: "Drinks",
        price: 70.0,
        imgUrl: "https://i.imgur.com/e07qxm4.png",
        isActive: true,
      },
      {
        id: 21,
        name: "Banana Smoothie",
        description:
          "Banana smoothie is a rich and creamy mixture of blended bananas and other simple ingredients like other fresh fruits and milk",
        category: "Drinks",
        price: 80.0,
        imgUrl: "https://i.imgur.com/LQphWsw.png",
        isActive: true,
      },
      {
        id: 22,
        name: "Calamansi Juice",
        description:
          "Calamansi juice is a popular drink that is made from calamansi, a small citrus fruit that is similar to a lime or lemon.",
        category: "Drinks",
        price: 70.0,
        imgUrl: "https://i.imgur.com/cL8ZJZw.png",
        isActive: true,
      },
      {
        id: 23,
        name: "Mango Juice",
        description:
          "Mango juice is a refreshing and delicious drink made from fresh mangoes.",
        category: "Drinks",
        price: 70.0,
        imgUrl: "https://i.imgur.com/2zuftSm.png",
        isActive: true,
      },
      {
        id: 24,
        name: "Orange Juice",
        description:
          "Orange juice is a classic and refreshing drink that can be enjoyed any time of the day.",
        category: "Drinks",
        price: 70.0,
        imgUrl: "https://i.imgur.com/Ly0eK1o.png",
        isActive: true,
      },
      // Appetizers
      {
        id: 25,
        name: "Cheese Sticks",
        description:
          "Cheese stick is a snack made with breaded and fried cheese sticks.",
        category: "Appetizer",
        price: 30.0,
        imgUrl: "https://i.imgur.com/9Zil2iI.png",
        isActive: true,
      },
      {
        id: 26,
        name: "Lumpiang Shanghai",
        description:
          "Lumpiang Shanghai is a popular Filipino appetizer made with ground pork and vegetables, wrapped in spring roll wrappers and deep-fried until crispy.",
        category: "Appetizer",
        price: 60.0,
        imgUrl: "https://i.imgur.com/jg2vxk0.png",
        isActive: true,
      },
      {
        id: 27,
        name: "Atsarang Papaya",
        description:
          "Atchara, also known as pickled papaya, is a Filipino condiment made with shredded unripe papaya, carrots, ginger, garlic, vinegar, and sugar.",
        category: "Appetizer",
        price: 60.0,
        imgUrl: "https://i.imgur.com/YAa57Vp.png",
        isActive: true,
      },
      {
        id: 28,
        name: "Crispy Dilis",
        description:
          "Crispy Dilis is a snack made from small anchovies that are deep-fried until crispy. It is often served with vinegar and garlic dip or eaten as is as crunchy and salty snack.",
        category: "Appetizer",
        price: 60.0,
        imgUrl: "https://i.imgur.com/a8DJeLl.png",
        isActive: true,
      },
      {
        id: 29,
        name: "Camaron Rebosado",
        description:
          "Camaron rebosado is a Filipino dish that consists of battered and deep-fried shrimp.",
        category: "Appetizer",
        price: 60.0,
        imgUrl: "https://i.imgur.com/buUi7in.png",
        isActive: true,
      },
      {
        id: 30,
        name: "Beef Empanada",
        description:
          "Beef empanada is a pastry filled with savory beef, vegetables, and spices.",
        category: "Appetizer",
        price: 60.0,
        imgUrl: "https://i.imgur.com/8xPs8Ss.png",
        isActive: true,
      },
      {
        id: 31,
        name: "Lumpiang Togue ",
        description:
          "Lumpiang togue is a vegetarian lumpia,the main ingredient of the filling is bean sprouts, also include other vegetables and even include seafood such as small shrimps or minimal amounts of ground meat to give the dish a meaty flavor.",
        category: "Appetizer",
        price: 40.0,
        imgUrl: "https://i.imgur.com/7z3PTls.png",
        isActive: true,
      },
      {
        id: 32,
        name: "Talong Balo-balo",
        description:
          "Talong bola-bola is a Filipino dish made from ground pork and minced eggplant, formed into meatballs and then fried or steamed.",
        category: "Appetizer",
        price: 60.0,
        imgUrl: "https://i.imgur.com/g1iJnTL.png",
        isActive: true,
      },
    ],
  })

  await prisma.reservationTable.deleteMany()
  await prisma.reservationTable.createMany({
    data: [
      {
        id: "1",
      },
      {
        id: "2",
      },
      {
        id: "3",
      },
      {
        id: "4",
      },
      {
        id: "5",
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error("An error occured while seeding the database:", e)
    await prisma.$disconnect()
    process.exit(1)
  })
