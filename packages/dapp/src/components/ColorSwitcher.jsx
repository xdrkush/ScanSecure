import {
  useColorMode,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react"
import { FaMoon, FaSun } from "react-icons/fa"

export const ColorModeSwitcher = (props ) => {
  const { toggleColorMode } = useColorMode()
  const text = useColorModeValue("dark", "light")
  const SwitchIcon = useColorModeValue(FaMoon, FaSun)

  return (
    <IconButton
      size="md"
      fontSize="lg"
      color="accent.100"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  )
}