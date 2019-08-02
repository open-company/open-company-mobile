import { requestOrGetPushNotificationToken } from './pushNotifications';

// Handles the web -> native side of the bridge (see oc.web.expo ns in open-company-web)
export const handleWebMessage = (webref, event) => {
    const { op, data } = JSON.parse(event.nativeEvent.data);
    switch (op) {
        case 'log':
            console.log(data);
            break;
        case 'get-push-notification-token':
            getPushNotificationToken(webref);
            break;
    }
};

const getPushNotificationToken = async (webref) => {
    console.log('Carrot web requesting push notification token');
    const token = await requestOrGetPushNotificationToken();
    if (token) {
        const cmd = `oc.web.expo.on_push_notification_token('${JSON.stringify(token)}'); true;`;
        console.log(cmd);
        webref.injectJavaScript(cmd);
    }
}