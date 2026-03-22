 ⚠ The Next.js plugin was not detected in your ESLint configuration. See https://nextjs.org/docs/app/api-reference/config/eslint#migrating-existing-config
Failed to compile.
./middleware.ts:44:16
Type error: Parameter 'cookiesToSet' implicitly has an 'any' type.
  42 |           return request.cookies.getAll();
  43 |         },
> 44 |         setAll(cookiesToSet) {
     |                ^
  45 |           cookiesToSet.forEach(({ name, value }) => {
  46 |             request.cookies.set(name, value);
  47 |           });
Next.js build worker exited with code: 1 and signal: null
Error: Command "npm run build" exited with 1
