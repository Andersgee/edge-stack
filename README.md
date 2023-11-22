# nextjs-boilerplate-app

nextjs project boilerplate configured according to my current taste

## first steps

1. copy paste `.env` and `.env.db` from examples
2. install `pnpm install`
3. start database `docker compose up`
4. push schema `pnpm prisma db push`
5. lets go `pnpm dev`

## sensible second steps

1. edit `public/manifest.webmanifest`
2. replace `public/icons`
3. edit default site_name in `src/utils/seo.ts`
4. follow steps in env file to configure oauth applications

## notes

- oauth boilerplate
- some utility functions
- trpc edge runtime for client components
  - eg `const {data} = api.post.getById.useQuery({postId})`
- call trpc procedures directly as regular functions in server components
  - eg `const data = await api.post.getById({postId})`
  - note that calling protected procedures `{ api, user } = await apiRsc()` in server components will opt route into dynamic rendering at request time
  - there is also `const { api } = apiRscPublic()` that does _not_ require dynamic rendering at request time, only for publicProcedures
- prisma for db schema handling only
  - `pnpm prisma generate` and `pnpm prisma db push`
- kysely query builder with fetch driver for nextjs http cache compatible db queries
  - eg `db({cache: "force-cache"}).selectFrom("Post").selectAll().execute()`
  - or `db({next: {tags: ["some-tag"]}}).selectFrom("Post").selectAll().execute()`
    - somewhere else: `revalidateTag("some-tag")`
  - or `db({next: {revalidate: 10}}).selectFrom("Post").selectAll().execute()`
  - regular `db()...` without args defaults to {cache:"no-store}
- tailwind with themed colors via css variables
  - eg `bg-some-color-700` instead of `bg-some-color-700 dark:bg-some-other-color-300`.
  - utility for generating css variables / config object from theme colors here: [todo create repo]()
- bunch of more specific configurations eslint, tailwind, next

### resources

[data cache usage and pricing](https://vercel.com/docs/infrastructure/data-cache/limits-and-pricing)

- The maximum size of an item in the cache is 2 MB. Items larger than this will not be cached.
- Tags per item – A cache item can have a maximum of 64 tags.
- Maximum tag length – The maximum tag length is 256 bytes.
