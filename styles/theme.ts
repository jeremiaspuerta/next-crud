// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
    fonts: {
        body: 'Inter'
    },
    styles: {
        global: {
            body : {
                bg: 'white'
            },
            'label,h2,button': {
                textTransform: 'capitalize'
            }
        }
        
    }
})

export default theme;