import { requestOrGetPushNotificationToken } from './pushNotifications';
import { useEffect } from 'react';
import { Notifications } from 'expo';

const stringifyBridgeData = (data) => {
    return JSON.stringify(data).replace(/\\"/g, "\\'");
}

const parseBridgeData = (str) => {
    return JSON.parse(str);
}

// Handles the web -> native side of the bridge (see oc.web.expo ns in open-company-web)
export const handleWebMessage = (webref, event) => {
    const { op, data } = parseBridgeData(event.nativeEvent.data);
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
        const cmd = `oc.web.expo.on_push_notification_token('${stringifyBridgeData(token)}'); true;`;
        console.log(cmd);
        webref.injectJavaScript(cmd);
    }
}


export function usePushNotificationHandler(component) {
    useEffect(() => {
        function handleNotification(notification) {
            console.log("Notification tapped!", notification.data);
            const cmd = `oc.web.expo.on_push_notification_tapped('${stringifyBridgeData(notification.data)}'); true;`;
            console.log(cmd);
            this.webref.injectJavaScript(cmd);
        }
        Notifications.addListener(handleNotification.bind(component));
    });
}