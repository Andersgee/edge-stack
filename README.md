# boilerplate

nextjs project boilerplate

- oauth boilerplate
- bunch utility functions
- trpc edge runtime for client components
  - eg `const {data} = api.post.getById.useQuery({postId})`
- call trpc procedures directly as regular functions in server components
  - eg `const data = await api.post.getById.fetch({postId})`
  - note that calling protected procedures `{ api, user } = await apiRsc()` in server components will opt route into dynamic rendering at request time
  - there is also `const api = apiRscPublic()` that does _not_ require dynamic rendering at request time, only for publicProcedures
- prisma for db schema handling only
  - `pnpm prisma generate` `pnpm prisma db push`
- kysely query builder with get() and post() for nextjs http cache compatible db queries
  - eg `db.selectFrom("Post").selectAll().get({cache: "force-cache"})`
  - or `db.selectFrom("Post").selectAll().get({cache: "force-cache", {next: {tags: ["some-tag"]}}})`
    - somewhere else: `revalidateTag("some-tag")`
  - or `db.selectFrom("Post").selectAll().get({next:{revalidate: 10}})`
- tailwind with themed colors via css variables
  - eg `bg-some-color-700` instead of `bg-some-color-700 dark:bg-some-other-color-300`.
  - utility for generating css variables / config object from theme colors here: [todo create repo]()
- bunch of more specific configurations eslint, tailwind, next

# steps

1. edit `public/manifest.webmanifest`
2. replace `public/icons`
3. edit default site_name in `src/utils/seo.ts`
4. create `.env` based on `.env.example`
   1. follow steps to configure oauth applications
   2. optionally edit `src/components/SigninButtons`
