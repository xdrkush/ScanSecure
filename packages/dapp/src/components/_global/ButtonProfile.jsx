import {
    Button, Menu, MenuButton,
    MenuList, MenuGroup, MenuDivider,
    MenuItem,
    Box,
} from "@chakra-ui/react"
import Link from 'next/link'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import { useContext } from "react";
import { ScanSecureContext } from "../../contexts";
import { Register } from "../profile/Register";

export default function ButtonProfile() {
    const { isConnected } = useAccount()
    const { isWhitelisted, isAdmin } = useContext(ScanSecureContext)

    return (
        <>
            {!isConnected ? (
                <Menu>
                    <ConnectButton
                        accountStatus={{
                            smallScreen: "avatar",
                            largeScreen: "full",
                        }}
                        chainStatus={{
                            smallScreen: "none",
                            largeScreen: "full",
                        }}
                    />
                </Menu>
            ) : (
                <>

                    {!isWhitelisted ? (
                        <Menu>
                            <Register />
                        </Menu>
                    ) : (
                        <Menu variant="droped">
                            <MenuButton as={Button}>
                                Profile
                            </MenuButton>

                            <MenuList px={2}>
                                <ConnectButton
                                    accountStatus={{
                                        smallScreen: "avatar",
                                        largeScreen: "full",
                                    }}
                                    chainStatus={{
                                        smallScreen: "none",
                                        largeScreen: "full",
                                    }}
                                />

                                <MenuGroup title='Profile'>
                                    <Link href="/profile"><MenuItem>My Account</MenuItem></Link>
                                </MenuGroup>

                                <MenuDivider />

                                {isAdmin && (
                                    <MenuGroup title='Admin'>
                                        <Link href="/admin"><MenuItem>Dashboard</MenuItem></Link>
                                    </MenuGroup>
                                )}

                            </MenuList>
                        </Menu>
                    )}
                </>
            )}
        </>
    )
}
