# 🍲Filipino de Cuisine

![Screenshot of the website](https://raw.githubusercontent.com/arvl130/filipino-de-cuisine/master/preview.png)

This is the website for the restaurant management system of Filipino de Cuisine—an imaginary Filipino restaurant.

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
