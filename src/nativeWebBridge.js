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
        case 'init':
            bridgeInit(webref);
            break;
        case 'org-loaded':
            bridgeOrgLoaded(webref, data);
            break;
        case 'request-push-notification-permission':
            bridgeRequestPushNotificationPermission(webref);
            break;
        case 'pend-push-notification':
            bridgePendPushNotification(webref, data);
            break;
        case 'get-deep-link-origin':
            bridgeGetDeepLinkOrigin(webref);
            break;
    }
};

var bridgeInitialized = false;
const bridgeInit = async (webref) => {
    // It's possible for web to call this many times. Ensure it only runs once.
    if (!bridgeInitialized) {
        console.log('bridgeInit called by web');
        bridgeInitialized = true;
    }
}

const bridgeOrgLoaded = async (webref, data) => {
    console.log(`bridgeOrgLoaded called by web: ${data}`);

    // Fire off any pending push notifications. See bridgePendPushNotification.
    const notifData = webref.carrot && webref.carrot.pendingNotificationTap;
    if (notifData) {
        const cmd = `oc.web.expo.on_push_notification_tapped('${stringifyBridgeData(notifData)}'); true;`;
        console.log(cmd);
        webref.injectJavaScript(cmd);
        delete webref.carrot.pendingNotificationTap;
    }
}

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

const bridgePendPushNotification = async (webref, notif) => {
    // It is possible for the web application to not be loaded yet when a push notification
    // is tapped by the user. This is the case when the app is backgrounded, for example.
    // When this circumstance is detected by the web app, it will signal the bridge to
    // pend that push notification until it is ready to handle it.
    // Readiness is signaled in the "org-loaded" bridge op.

    // Buffer the pending notification on the webref object for ease of access later.
    webref.carrot = {
        pendingNotificationTap: notif
    };
}

const bridgeGetDeepLinkOrigin = async (webref) => {
    console.log('bridgeGetDeepLinkOrigin called by web');
    const deepUrl = Linking.makeUrl('/');
    let cmd = `oc.web.expo.on_deep_link_origin('${stringifyBridgeData(deepUrl)}'); true;`;
    console.log(cmd);
    webref.injectJavaScript(cmd);
}

export function usePushNotificationHandler(component) {
    useEffect(() => {
        function handleNotification(notification) {
            // Expo sets origin='received' when a push notification is received while app is foregrounded,
            // and triggers this event immediately. In this case, our web app is already equipped to
            // display an in-app notification, and so there's nothing to be done on this side of the bridge.
            if (notification.origin !== 'received') {
                console.log("Notification tapped!", notification.data);
                const cmd = `
                    oc.web.expo.on_push_notification_tapped('${stringifyBridgeData(notification.data)}');
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