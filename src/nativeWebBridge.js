import { requestPushNotificationPermission } from './pushNotifications';
import { useEffect } from 'react';
import { Notifications, Linking } from 'expo';
import url from 'url';

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
        case 'request-push-notification-permission':
            bridgeRequestPushNotificationPermission(webref);
            break;
        case 'get-deep-link-origin':
            bridgeGetDeepLinkOrigin(webref);
            break;
        case 'ready':
            bridgeReady(webref);
            break;
    }
};

const bridgeRequestPushNotificationPermission = async (webref) => {
    console.log('bridgeRequestPushNotificationToken called by web');
    const token = await requestPushNotificationPermission();
    let cmd = '';
    if (token) {
        cmd = `oc.web.expo.on_push_notification_permission('${stringifyBridgeData(token)}'); true;`;
    } else {
        cmd = `oc.web.expo.on_push_notification_permission(null); true;`;
    }
    console.log(cmd);
    webref.injectJavaScript(cmd);
}

const bridgeGetDeepLinkOrigin = async (webref) => {
    console.log('bridgeGetDeepLinkOrigin called by web');
    const deepUrl = Linking.makeUrl('/');
    let cmd = `oc.web.expo.on_deep_link_origin('${stringifyBridgeData(deepUrl)}'); true;`;
    console.log(cmd);
    webref.injectJavaScript(cmd);
}

const bridgeReady = async (webref) => {
    console.log('bridgeReady called by web');
    const notifData = webref.carrot && webref.carrot.pendingNotificationTap;
    if (notifData) {
        const cmd = `oc.web.expo.on_push_notification_tapped('${stringifyBridgeData(notifData)}'); true;`;
        console.log(cmd);
        webref.injectJavaScript(cmd);
        delete webref.carrot.pendingNotificationTap;
    }
}

export function usePushNotificationHandler(component) {
    useEffect(() => {
        function handleNotification(notification) {
            // Expo sets origin='received' when a push notification is received while app is foregrounded,
            // and triggers this event immediately. In this case, our web app is already equipped to
            // display an in-app notification, and so there's nothing to be done on this side of the bridge.
            if (notification.origin !== 'received') {
                console.log("Notification tapped!", notification.data);
                // The command that we inject is conditional upon whether the embedded web application is
                // actually loaded or not. If it is, we can run the tap handler immediately. Otherwise,
                // we need to buffer the event somewhere so the web application can poll for it once loaded.
                // Without this, notifcation taps on a cold start of the app would be completely dropped.
                // This buffer can then be injected in the `bridgeReady` event.
                this.webref.carrot = {
                    pendingNotificationTap: notification.data
                };
                const cmd = `
                    if (window.oc) {
                        oc.web.expo.on_push_notification_tapped('${stringifyBridgeData(notification.data)}');
                    }
                    true;
                `;
                console.log(cmd);
                this.webref.injectJavaScript(cmd);
            }
        }
        Notifications.addListener(handleNotification.bind(component));
    });
}

export function useDeepLinkHandler(component, webViewUrl) {
    useEffect(() => {
        function handleDeepLink(deepLink) {
            // console.log("Handling deep link:", url);
            const { path, queryParams } = Linking.parse(deepLink.url);
            const updatedPath = path.startsWith('/') ? path : '/' + path;
            const resolved = url.resolve(webViewUrl, updatedPath);
            console.log(`Resolved deep link to: ${resolved}`);
            const parsed = url.parse(resolved);
            parsed.query = queryParams;
            const formatted = url.format(parsed);
            const cmd = `window.location = '${formatted}'; true;`;
            console.log(cmd);
            this.webref.injectJavaScript(cmd);
        }
        Linking.addEventListener('url', handleDeepLink.bind(component));
    });
}