import { requestPushNotificationPermission } from './pushNotifications';
import { useCallback, useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import {default as Constants} from 'expo-constants';
import {Appearance} from 'react-native-appearance';
import * as URL from 'url';

const stringifyBridgeData = (data) => {
    return JSON.stringify(data).replace(/\\"/g, "\\'");
}

const parseBridgeData = (str) => {
    return JSON.parse(str);
}

// Handles the web -> native side of the bridge (see oc.web.expo ns in open-company-web)
export const handleWebMessage = (webViewRef, event) => {
    const { op, data } = parseBridgeData(event.nativeEvent.data);
    console.log(`handleWebMessage`)
    switch (op) {
        case 'log':
            console.log(data);
            break;
        case 'request-push-notification-permission':
            bridgeRequestPushNotificationPermission(webViewRef);
            break;
        case 'get-deep-link-origin':
            bridgeGetDeepLinkOrigin(webViewRef);
            break;
        case 'get-app-version':
            bridgeGetAppVersion(webViewRef);
            break;
        case 'get-color-scheme':
            bridgeGetColorScheme(webViewRef);
    }
};

const bridgeRequestPushNotificationPermission = async (webViewRef) => {
    console.log('bridgeRequestPushNotificationToken called by web');
    const token = await requestPushNotificationPermission();
    let cmd = '';
    if (token) {
        cmd = `oc.web.expo.on_push_notification_permission('${stringifyBridgeData(token)}'); true;`;
    } else {
        cmd = `oc.web.expo.on_push_notification_permission(null); true;`;
    }
    console.log(cmd);
    webViewRef.current.injectJavaScript(cmd);
}

const bridgeGetDeepLinkOrigin = async (webViewRef) => {
    console.log('bridgeGetDeepLinkOrigin called by web');
    const deepUrl = Linking.makeUrl('/');
    const cmd = `oc.web.expo.on_deep_link_origin('${stringifyBridgeData(deepUrl)}'); true;`;
    console.log(cmd);
    webViewRef.current.injectJavaScript(cmd);
}

const bridgeGetAppVersion = async (webViewRef) => {
    console.log('bridgeGetAppVersion called by web');
    const versionString = `${Constants.manifest.version} (${Constants.nativeBuildVersion})`;
    const cmd = `oc.web.expo.on_app_version('${versionString}'); true;`;
    console.log(cmd);
    webViewRef.current.injectJavaScript(cmd);
}

const bridgeGetColorScheme = async (webViewRef) => {
    console.log('bridgeGetColorScheme called by web');
    const colorScheme = Appearance.getColorScheme();
    const cmd = `oc.web.expo.on_color_scheme_change('${colorScheme}'); true;`;
    console.log(cmd);
    webViewRef.current.injectJavaScript(cmd);
}

export function usePushNotificationHandler(webViewRef, webViewUrl) {
    const handleNotification = useCallback((notification) => {
        // Expo sets origin='received' when a push notification is received while app is foregrounded,
        // and triggers this event immediately. In this case, our web app is already equipped to
        // display an in-app notification, and so there's nothing to be done on this side of the bridge.
        if (notification.origin !== 'received') {
            console.log("Notification tapped!", notification.data);
            const notificationPath = notification.data['url-path'];
            if (notificationPath) {
                const resolved = URL.resolve(webViewUrl, notificationPath);
                const cmd = `window.location = '${resolved}'; true;`;
                console.log(cmd);
                webViewRef.current.injectJavaScript(cmd);
            }
        }
    });

    useEffect(() => {
        const subscription = Notifications.addPushTokenListener(handleNotification);
        if (subscription)
            return () => subscription.remove();
    }, [handleNotification]);
}

export function useDeepLinkHandler(webViewRef, webViewUrl) {
    const handleDeepLink = useCallback((deepLink) => {
        console.log(`Handling deep link: ${deepLink}`);
        const parsedUrl = Linking.parse(deepLink.url);
        // Used only in dev to avoid 404 redirects
        const updatedPath = parsedUrl.path && parsedUrl.path.startsWith('/') ? parsedUrl.path : '/' + parsedUrl.path;
        const resolved = URL.resolve(webViewUrl, updatedPath);
        const parsed = URL.parse(resolved);
        parsed.query = parsedUrl.queryParams;
        const formatted = URL.format(parsed);
        const cmd = `window.location = '${formatted}'; true;`;
        console.log(cmd);
        webViewRef.current.injectJavaScript(cmd);
    });

    useEffect(() => {
        const subscription = Linking.addEventListener('url', handleDeepLink);
        if (subscription)
            return () => subscription.remove();
    }, [handleDeepLink]);
}


export function useColorSchemeHandler(webViewRef) {
    const handleColorSchemeChange = useCallback(({ colorScheme }) => {
        console.log(`Handling color scheme change`);
        // do something with color scheme
        const cmd = `oc.web.expo.on_color_scheme_change('${colorScheme}'); true;`;
        console.log(cmd);
        webViewRef.current.injectJavaScript(cmd);
    });

    useEffect(() => {
        const subscription = Appearance.addChangeListener(handleColorSchemeChange);
        if (subscription)
            return () => subscription.remove();
    }, [handleColorSchemeChange]);
}