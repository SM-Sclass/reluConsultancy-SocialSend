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
        Sendermessage: 'Hi {username}!',
        Daily_Friend_Request_Limit: 45,
        Daily_Like_Limit: 210,
        Daily_Direct_Message_Limit: 51,
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