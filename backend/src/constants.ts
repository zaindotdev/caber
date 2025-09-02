export const events = Object.freeze({
    CLIENT_CONNECT: 'client:connect',
    CLIENT_DISCONNECT: 'client:disconnect',
    ROOM_JOIN: 'room:join',
    ROOM_LEAVE: 'room:leave',
    NEW_MESSAGE: 'chat:message',
    USER_TYPING: 'chat:typing',
    USER_STOP_TYPING: 'chat:stopTyping',
    RIDE_BOOK: 'ride:book',
    RIDE_END: 'ride:end',
} as const);
