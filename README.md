# 🍲Filipino de Cuisine

![Screenshot of the website](https://raw.githubusercontent.com/arvl130/filipino-de-cuisine/master/preview.png)

This is the website for the restaurant management system of Filipino de Cuisine—an imaginary Filipino restaurant. [Check out our menu](https://filipinodecuisine.ageulin.com/menu) and [order now](https://filipinodecuisine.ageulin.com).

## Features

- Responsive frontend design
- Streamlined ordering and delivery monitoring
- Efficient reservation scheduling and management
- Secure payments with [GCash](https://www.gcash.com) and [Maya](https://www.maya.ph)
- Sign in with Email, Google, and Facebook

## Tech Stack

- [React](https://react.dev) and [Next.js](https://nextjs.org) with [tRPC](https://trpc.io) for frontend and backend
- [Tailwind CSS](tailwindcss.com) for styling
- [Firebase](https://firebase.google.com) for authentication
- [Paymongo](https://www.paymongo.com) for payments
- [MySQL](https://www.mysql.com) for the database
- [Tanstack Query](https://tanstack.com/query/latest) for caching

## Entity Relationship Diagram

![ERD of the system](https://raw.githubusercontent.com/arvl130/filipino-de-cuisine/master/erd.jpg)

## Setup

This project requires at least Node.js v16.17 to be installed and uses `pnpm` for package management.

For the database, MySQL is the preferred option.

Take the following steps to setup this project:

1. Clone this repository.

```sh
$ git clone https://github.com/arvl130/filipino-de-cuisine.git
```

2. Install the project dependencies.

```sh
$ pnpm install
```

3. Setup the API keys and database secrets.

```sh
$ cp .env.template .env
$ vi .env # type :wq! to exit
```

4. Push the schema to the database.

```sh
$ pnpm prisma db push
```

5. Run the project.

```sh
$ pnpm dev
```

6. Build for production. (optional)

```sh
$ pnpm build
```

## License

This project is licensed under the MIT License.

Copyright © 2023 Angelo Geulin, Angel Marie Lucero, Sheejay Bumanglag, Kenneth Paredes, Angelo Abellera, Mariel Elaine Lopez
