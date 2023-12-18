export type PlayerLineProps = {
    player: string
}

export type MinecraftServer = {
    name: string,
    status: string,
    online: string[],
    playersOnline: number
}

export type ServerCardProps = {
    server: MinecraftServer
}