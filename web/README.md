# GoFundYourself - Web Frontend

The web frontend for the GoFundYourself app.

## Usage

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm run build
npm start
```

## Docker

To deploy the app inside a Docker container, run the following commands:

```bash
docker build -t gofundyourself-frontend .
docker run -p 8080:3000 gofundyourself-frontend
```

## Cypress testing

```bash
npm run cypress
```
