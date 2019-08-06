import { requestOrGetPushNotificationToken } from './pushNotifications';
import { useEffect } from 'react';
import { Notifications } from 'expo';

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


export function usePushNotificationHandler(component) {
    useEffect(() => {
        function handleNotification(notification) {
            console.log("Notification tapped!", notification.data);
            // TODO: this field leads to issues in JSON serialization due to the use of escaped double quotes.
            // For sending richer data structures over the bridge, a more robust solution needs to be devised.
            delete notification.data.content;
            const cmd = `oc.web.expo.on_push_notification_tapped('${JSON.stringify(notification.data)}'); true;`;
            console.log(cmd);
            this.webref.injectJavaScript(cmd);
        }
        Notifications.addListener(handleNotification.bind(component));
    });
}