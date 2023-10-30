# boilerplate

nextjs14 project boilerplate

- oauth boilerplate
- call trpc procedures in both server and client components
- kysely query builder with http GET for select and http POST for others
- tailwind with auto themed colors via css variables eg "color-primary-700" instead of "color-primary-700 dark:color-primary-300". generate theme color variables here: [todo create repo]()
- other utils

# steps

1. edit `public/manifest.webmanifest`
2. replace `public/icons`
3. edit default site_name in `src/utils/seo.ts`
4. create `.env` based on `.env.example`
   1. follow steps to configure oauth applications
   2. optionally edit `src/components/SigninButtons`
