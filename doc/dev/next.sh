#!/bin/sh

echo "use that at the root of your Next.js project !"
sh -c 'yarn install && yarn add @radix-ui/react-checkbox @radix-ui/react-popover cmdk @radix-ui/react-scroll-area @tanstack/react-table && npx shadcn-ui@latest add badge button card checkbox table dropdown-menu form input label separator table tabs toast scroll-area'
