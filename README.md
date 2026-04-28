# Бие даалт 11 — API Design

**Оюутан:** Батбаяр Билгүүн
**Код:** B242270035

## Ажлын товч тойм

А хэсэгт муу API дизайны 6 алдааг илрүүлж, сайжруулсан UserManager классыг
бичсэн. Cache сангийн LRU, LFU, TTL гурван хэрэгжилтийг Factory паттернаар
хийсэн. Б хэсэгт номын сангийн REST API-г Express.js ашиглан хэрэгжүүлсэн.

## А хэсэг ажиллуулах

```bash
cd partA
npm install
npm test
```

## Б хэсэг ажиллуулах

```bash
cd partB
npm install
npm run start
```

## Тулгарсан бэрхшээл

- tsconfig.json-д verbatimModuleSyntax асаалттай байснаас export алдаа гарсан.
  module: commonjs болгож засав.
- LFUCache-д K | undefined төрлийн алдаа гарсан. as K cast нэмж засав.
- ts-jest-д moduleResolution deprecated алдаа гарсан.
  ignoreDeprecations: "6.0" нэмж засав.

## Дүгнэлт

API дизайны зарчмууд (мэдээллийн далдлалт, тодорхой нэршил, exception
ашиглах) нь кодын чанар болон засвар үйлчилгээнд ихээхэн нөлөөлдөг болохыг
практикаар ойлгосон.
