// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
    fonts: {
        body: 'system-ui'
    },
    styles: {
        global: {
            body : {
                bg: 'white'
            },
            'label,h2,button': {
                textTransform: 'capitalize'
            },
            'a':{
                color: 'teal.500'
            }
        }
        
    }
})

export default theme;