import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

/*
Returns null if the user has not granted the push notification permission, or returns
the push token that uniquely identifies this device if the permission has been previously
granted. To request notification permission (on iOS only), use the requestPushNotificationPermission()
function.
*/
export async function getPushNotificationToken() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (existingStatus !== 'granted') {
        return null;
    }

    // Get the token that uniquely identifies this device
    return Notifications.getExpoPushTokenAsync();
}

/*
Displays the push notification permission dialog to the user, and returns the push token
that uniquely identifies this device if the user grants permission, or null if permission is
denied. Note that this function is truly only relevant on iOS devices. On Android, permissions
are granted upon installation. If you just wish to retrieve the device's unique push token without
displaying the permission dialog, use the getPushNotificationToken() function.
*/
export async function requestPushNotificationPermission() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return null;
    }

    // Get the token that uniquely identifies this device
    return Notifications.getExpoPushTokenAsync();
}