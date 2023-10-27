import './globals.css'
import type { Metadata } from 'next'
import { Roboto, Kodchasan } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/components/auth-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from "@/components/ui/tooltip"
import ProtectedRoute from '@/components/protected-route'
import Overlay from "@/components/overlay";

// Import the Roboto font with specified subsets and weight
const roboto = Roboto({ subsets: ['latin'], weight: '300', variable: '--font-roboto' })
const kodchasan = Kodchasan({ subsets: ['latin'], weight: '400', variable: '--font-kodchasan' })

// Define the metadata object
export const metadata: Metadata = {
  // The title of the page
  title: 'IUT Connect',
  // The description of the page
  description: 'Trouvez votre alternance',
  // the logo of the page
  icons: './logo.svg'
}

/**
 * RootLayout component.
 * 
 * @param children - The child components to render.
 * @returns The rendered RootLayout component.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // useEffect(() => {

  // })

  return (
    // Render the HTML document with French language
    <html lang="fr">
      <body className={`${kodchasan.variable} font-roboto`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <AuthProvider> {/* Render the AuthProvider component */}
              <ProtectedRoute> {/* Render the ProtectedRoute component */}
                <TooltipProvider>
                  <Overlay>
                    {children}
                  </Overlay>
                </TooltipProvider>
              </ProtectedRoute>
            </AuthProvider>
            <Toaster /> {/* Render the Toaster component */}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
function useEffect(arg0: () => void) {
  throw new Error('Function not implemented.')
}

