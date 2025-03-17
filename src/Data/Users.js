export const userArray = [{
    platform: 'Instagram',
    username: 'glow.doggies',
    dailyMessages: '24/50',
    dailyConnections: '15/50',
    warmupEnabled: true,
    settings: {
        sendername: {
            firstName: "Col",
            lastname: "Harris",
        },
        Sendermessage: 'Hi! how are you?',
        Daily_Friend_Request_Limit: 10,
        Daily_Like_Limit: 10,
        Daily_Direct_Message_Limit: 10,
    },
}];
export const defaultUserStructure = (username) => ({
    username,
    platform: "Instagram",
    dailyMessages: "0/50",
    dailyConnections: "0/50",
    warmupEnabled: false,
    settings: {
        sendername: {
            firstName: "Colis",
            lastname: "anyname",
        },
        Sendermessage: 'Hi {username}!',
        Daily_Friend_Request_Limit: 20,
        Daily_Like_Limit: 20,
        Daily_Direct_Message_Limit: 20,
    },
});