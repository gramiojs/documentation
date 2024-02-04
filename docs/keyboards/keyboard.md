# Keyboard

This keyboard is shown under the input field and also known as Reply Keyboard.

## Import

### With GramIO

```ts
import { Keyboard } from "gramio";
```

### Without GramIO

```ts
import { Keyboard } from "@gramio/keyboards";
```

## Buttons ([Documentation](https://core.telegram.org/bots/api/#keyboardbutton))

Buttons are methods that assemble a keyboard for you.

### text

Text button. It will be sent as a message when the button is pressed

```ts
new Keyboard().text("some button text");
```

### requestUsers

Request users button. Pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a `users_shared` service message. Available in private chats only. `Second parameter` is signed 32-bit identifier of the request that will be received back in the [UsersShared](https://core.telegram.org/bots/api/#usersshared) object. Must be unique within the message

```ts
new Keyboard().requestUsers("some button text", 228, {
    user_is_premium: true,
});
```

More about options in [documentation](https://core.telegram.org/bots/api/#keyboardbuttonrequestusers)

### requestChats

Request users button. Pressing the button will open a list of suitable chats. Tapping on a chat will send its identifier to the bot in a `chat_shared` service message. Available in private chats only.. Available in private chats only. `Second parameter` is signed 32-bit identifier of the request, which will be received back in the [ChatShared](https://core.telegram.org/bots/api/#chatshared) object. Must be unique within the message

```ts
new Keyboard().requestChat("gramio", 255, {
    chat_is_forum: true,
});
```

> [!WARNING]
> By default, the `chat_is_channel` parameter is false!

More about options in [documentation](https://core.telegram.org/bots/api/#keyboardbuttonrequestchat)

### requestPoll

Request poll button. Pressing the button will open a list of suitable users. Identifiers of selected users will be sent to the bot in a `users_shared` service message. Available in private chats only.

```ts
new Keyboard().requestPoll("some button text", "quiz");
```

More about options in [documentation](https://core.telegram.org/bots/api/#keyboardbuttonpolltype)

### requestLocation

Request user's location button. The user's current location will be sent when the button is pressed. Available in private chats only.

```ts
new Keyboard().requestLocation("some button text");
```

### requestContact

Request contact button. The user's phone number will be sent as a contact when the button is pressed. Available in private chats only.

```ts
new Keyboard().requestContact("some button text");
```

### webApp

webApp button. Described [Web App](https://core.telegram.org/bots/webapps) will be launched when the button is pressed. The Web App will be able to send a `web_app_data` service message. Available in private chats only.

```ts
new Keyboard().webApp("some button text", "https://...");
```
