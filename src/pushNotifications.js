import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

/*
Displays the push notification permission dialog to the user, and returns the push token
that uniquely identifies this device if the user grants permission, or null if permission is
denied. Note that this function is truly only relevant on iOS devices. On Android, permissions
are granted upon installation. If you just wish to retrieve the device's unique push token without
displaying the permission dialog, use the getPushNotificationToken() function.
*/

export async function requestPushNotificationPermission() {
    let token;
    if (Constants.isDevice) {

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
        token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    // On Android we need to setup at least the notifications default channel
    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FFFBFAF9',
        });
    }

    return token;
}