
## Configure API address

```bash
cd ui-domain
vi api.js
```

set api address

```javascript
// development environment
export const dev = {
  base: 'your api address',
  seller: 'your api address'
}

// production environment
export const pro = {
  base: env.API_BASE || 'your api address',
  seller: env.API_SELLER || 'your api address'
}

```


## Development
npm
```bash
npm install
npm run dev
```

yarn

```bash
yarn
yarn run dev
```


## Publish
npm
```bash
npm run build:prod
```

yarn
```bash
yarn run build:prod
```