import React from 'react';

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

export type User = {
    username: string,
    avatar: string,
    id: string,
    email: string,
    refresh_token: string,
    permissions: object
}

export type AuthContextType = [
    User | undefined,
    React.Dispatch<React.SetStateAction<User>>,
    (server: string, permission: string) => boolean
]

export type PermissionType = {
    permission: string,
    server: string
}

export type ToastType = {
    title: string,
    description: string,
    type: string
}