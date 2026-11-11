# bestpoint

An Express application for browsing places and managing place listings and reviews.

[Repository](https://github.com/MirzaAlbab/bestpoint)

## Features

- Place and review routes
- Passport-based account authentication
- Author and ObjectId middleware
- Joi schemas and EJS templates

## Technology

`ejs` ^3.1.10 · `express` ^4.19.2 · `mongoose` ^8.5.1

## Getting started

Install Node.js and start a local MongoDB instance.

```bash
git clone https://github.com/MirzaAlbab/bestpoint.git
cd bestpoint
```

```bash
npm install
node app.js
```

Open [http://localhost:3000](http://localhost:3000). Review `app.js` to change the MongoDB connection or listening port.

## Development and checks

The `npm test` command is a placeholder. Exercise create, read, update, and delete flows against a disposable development database.

## Project structure

- `config/` — Application configuration
- `controllers/` — Request handlers
- `middleware/` — Request middleware
- `models/` — Data models
- `public/` — Public web assets and entry points
- `routes/` — HTTP route definitions
- `schemas/` — Validation schemas
- `seeds/` — Development seed scripts

## Project notes

The source connects to mongodb://127.0.0.1/bestpoints and listens on port 3000. Review session configuration before using it beyond local development.

## License

No root `LICENSE` file was present in the reviewed repository. Consult the repository owner about reuse; dependencies and third-party assets retain their own terms.
