# Telegram Bot API Methods Index

> Auto-generated from Bot API v9.4. Full docs at **https://gramio.dev/telegram/**

When a user asks about a specific Telegram Bot API method, reference the GramIO doc page.
Each method page has: full parameter reference with types, GramIO TypeScript examples, common errors, and tips.

To look up a **type/object** (e.g. `Message`, `User`, `InlineKeyboardMarkup`):
→ https://gramio.dev/telegram/types/{TypeName}
→ Full types index: https://gramio.dev/telegram/ (scroll to Types section)
→ Key type: [Update](/telegram/types/Update) — the root object for all incoming updates

## Methods (165)

| Method | Description |
|--------|-------------|
| [getUpdates](/telegram/methods/getUpdates) | Use this method to receive incoming updates using long polling (wiki). |
| [setWebhook](/telegram/methods/setWebhook) | Use this method to specify a URL and receive incoming updates via an outgoing webhook. |
| [deleteWebhook](/telegram/methods/deleteWebhook) | Use this method to remove webhook integration if you decide to switch back to getUpdates. |
| [getWebhookInfo](/telegram/methods/getWebhookInfo) | Use this method to get current webhook status. |
| [getMe](/telegram/methods/getMe) | A simple method for testing your bot's authentication token. |
| [logOut](/telegram/methods/logOut) | Use this method to log out from the cloud Bot API server before launching the bot locally. |
| [close](/telegram/methods/close) | Use this method to close the bot instance before moving it from one local server to another. |
| [sendMessage](/telegram/methods/sendMessage) | Use this method to send text messages. |
| [forwardMessage](/telegram/methods/forwardMessage) | Use this method to forward messages of any kind. |
| [forwardMessages](/telegram/methods/forwardMessages) | Use this method to forward multiple messages of any kind. |
| [copyMessage](/telegram/methods/copyMessage) | Use this method to copy messages of any kind. |
| [copyMessages](/telegram/methods/copyMessages) | Use this method to copy messages of any kind. |
| [sendPhoto](/telegram/methods/sendPhoto) | Use this method to send photos. |
| [sendAudio](/telegram/methods/sendAudio) | Use this method to send audio files, if you want Telegram clients to display them in the music player. |
| [sendDocument](/telegram/methods/sendDocument) | Use this method to send general files. |
| [sendVideo](/telegram/methods/sendVideo) | Use this method to send video files, Telegram clients support MPEG4 videos (other formats may be sent as Document). |
| [sendAnimation](/telegram/methods/sendAnimation) | Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). |
| [sendVoice](/telegram/methods/sendVoice) | Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. |
| [sendVideoNote](/telegram/methods/sendVideoNote) | As of v.4.0, Telegram clients support rounded square MPEG4 videos of up to 1 minute long. |
| [sendPaidMedia](/telegram/methods/sendPaidMedia) | Use this method to send paid media. |
| [sendMediaGroup](/telegram/methods/sendMediaGroup) | Use this method to send a group of photos, videos, documents or audios as an album. |
| [sendLocation](/telegram/methods/sendLocation) | Use this method to send point on the map. |
| [sendVenue](/telegram/methods/sendVenue) | Use this method to send information about a venue. |
| [sendContact](/telegram/methods/sendContact) | Use this method to send phone contacts. |
| [sendPoll](/telegram/methods/sendPoll) | Use this method to send a native poll. |
| [sendChecklist](/telegram/methods/sendChecklist) | Use this method to send a checklist on behalf of a connected business account. |
| [sendDice](/telegram/methods/sendDice) | Use this method to send an animated emoji that will display a random value. |
| [sendMessageDraft](/telegram/methods/sendMessageDraft) | Use this method to stream a partial message to a user while the message is being generated; supported only for bots with |
| [sendChatAction](/telegram/methods/sendChatAction) | Use this method when you need to tell the user that something is happening on the bot's side. |
| [setMessageReaction](/telegram/methods/setMessageReaction) | Use this method to change the chosen reactions on a message. |
| [getUserProfilePhotos](/telegram/methods/getUserProfilePhotos) | Use this method to get a list of profile pictures for a user. |
| [getUserProfileAudios](/telegram/methods/getUserProfileAudios) | Use this method to get a list of profile audios for a user. |
| [setUserEmojiStatus](/telegram/methods/setUserEmojiStatus) | Changes the emoji status for a given user that previously allowed the bot to manage their emoji status via the Mini App |
| [getFile](/telegram/methods/getFile) | Use this method to get basic information about a file and prepare it for downloading. |
| [banChatMember](/telegram/methods/banChatMember) | Use this method to ban a user in a group, a supergroup or a channel. |
| [unbanChatMember](/telegram/methods/unbanChatMember) | Use this method to unban a previously banned user in a supergroup or channel. |
| [restrictChatMember](/telegram/methods/restrictChatMember) | Use this method to restrict a user in a supergroup. |
| [promoteChatMember](/telegram/methods/promoteChatMember) | Use this method to promote or demote a user in a supergroup or a channel. |
| [setChatAdministratorCustomTitle](/telegram/methods/setChatAdministratorCustomTitle) | Use this method to set a custom title for an administrator in a supergroup promoted by the bot. |
| [banChatSenderChat](/telegram/methods/banChatSenderChat) | Use this method to ban a channel chat in a supergroup or a channel. |
| [unbanChatSenderChat](/telegram/methods/unbanChatSenderChat) | Use this method to unban a previously banned channel chat in a supergroup or channel. |
| [setChatPermissions](/telegram/methods/setChatPermissions) | Use this method to set default chat permissions for all members. |
| [exportChatInviteLink](/telegram/methods/exportChatInviteLink) | Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. |
| [createChatInviteLink](/telegram/methods/createChatInviteLink) | Use this method to create an additional invite link for a chat. |
| [editChatInviteLink](/telegram/methods/editChatInviteLink) | Use this method to edit a non-primary invite link created by the bot. |
| [createChatSubscriptionInviteLink](/telegram/methods/createChatSubscriptionInviteLink) | Use this method to create a subscription invite link for a channel chat. |
| [editChatSubscriptionInviteLink](/telegram/methods/editChatSubscriptionInviteLink) | Use this method to edit a subscription invite link created by the bot. |
| [revokeChatInviteLink](/telegram/methods/revokeChatInviteLink) | Use this method to revoke an invite link created by the bot. |
| [approveChatJoinRequest](/telegram/methods/approveChatJoinRequest) | Use this method to approve a chat join request. |
| [declineChatJoinRequest](/telegram/methods/declineChatJoinRequest) | Use this method to decline a chat join request. |
| [setChatPhoto](/telegram/methods/setChatPhoto) | Use this method to set a new profile photo for the chat. |
| [deleteChatPhoto](/telegram/methods/deleteChatPhoto) | Use this method to delete a chat photo. |
| [setChatTitle](/telegram/methods/setChatTitle) | Use this method to change the title of a chat. |
| [setChatDescription](/telegram/methods/setChatDescription) | Use this method to change the description of a group, a supergroup or a channel. |
| [pinChatMessage](/telegram/methods/pinChatMessage) | Use this method to add a message to the list of pinned messages in a chat. |
| [unpinChatMessage](/telegram/methods/unpinChatMessage) | Use this method to remove a message from the list of pinned messages in a chat. |
| [unpinAllChatMessages](/telegram/methods/unpinAllChatMessages) | Use this method to clear the list of pinned messages in a chat. |
| [leaveChat](/telegram/methods/leaveChat) | Use this method for your bot to leave a group, supergroup or channel. |
| [getChat](/telegram/methods/getChat) | Use this method to get up-to-date information about the chat. |
| [getChatAdministrators](/telegram/methods/getChatAdministrators) | Use this method to get a list of administrators in a chat, which aren't bots. |
| [getChatMemberCount](/telegram/methods/getChatMemberCount) | Use this method to get the number of members in a chat. |
| [getChatMember](/telegram/methods/getChatMember) | Use this method to get information about a member of a chat. |
| [setChatStickerSet](/telegram/methods/setChatStickerSet) | Use this method to set a new group sticker set for a supergroup. |
| [deleteChatStickerSet](/telegram/methods/deleteChatStickerSet) | Use this method to delete a group sticker set from a supergroup. |
| [getForumTopicIconStickers](/telegram/methods/getForumTopicIconStickers) | Use this method to get custom emoji stickers, which can be used as a forum topic icon by any user. |
| [createForumTopic](/telegram/methods/createForumTopic) | Use this method to create a topic in a forum supergroup chat or a private chat with a user. |
| [editForumTopic](/telegram/methods/editForumTopic) | Use this method to edit name and icon of a topic in a forum supergroup chat or a private chat with a user. |
| [closeForumTopic](/telegram/methods/closeForumTopic) | Use this method to close an open topic in a forum supergroup chat. |
| [reopenForumTopic](/telegram/methods/reopenForumTopic) | Use this method to reopen a closed topic in a forum supergroup chat. |
| [deleteForumTopic](/telegram/methods/deleteForumTopic) | Use this method to delete a forum topic along with all its messages in a forum supergroup chat or a private chat with a |
| [unpinAllForumTopicMessages](/telegram/methods/unpinAllForumTopicMessages) | Use this method to clear the list of pinned messages in a forum topic in a forum supergroup chat or a private chat with |
| [editGeneralForumTopic](/telegram/methods/editGeneralForumTopic) | Use this method to edit the name of the 'General' topic in a forum supergroup chat. |
| [closeGeneralForumTopic](/telegram/methods/closeGeneralForumTopic) | Use this method to close an open 'General' topic in a forum supergroup chat. |
| [reopenGeneralForumTopic](/telegram/methods/reopenGeneralForumTopic) | Use this method to reopen a closed 'General' topic in a forum supergroup chat. |
| [hideGeneralForumTopic](/telegram/methods/hideGeneralForumTopic) | Use this method to hide the 'General' topic in a forum supergroup chat. |
| [unhideGeneralForumTopic](/telegram/methods/unhideGeneralForumTopic) | Use this method to unhide the 'General' topic in a forum supergroup chat. |
| [unpinAllGeneralForumTopicMessages](/telegram/methods/unpinAllGeneralForumTopicMessages) | Use this method to clear the list of pinned messages in a General forum topic. |
| [answerCallbackQuery](/telegram/methods/answerCallbackQuery) | Use this method to send answers to callback queries sent from inline keyboards. |
| [getUserChatBoosts](/telegram/methods/getUserChatBoosts) | Use this method to get the list of boosts added to a chat by a user. |
| [getBusinessConnection](/telegram/methods/getBusinessConnection) | Use this method to get information about the connection of the bot with a business account. |
| [setMyCommands](/telegram/methods/setMyCommands) | Use this method to change the list of the bot's commands. |
| [deleteMyCommands](/telegram/methods/deleteMyCommands) | Use this method to delete the list of the bot's commands for the given scope and user language. |
| [getMyCommands](/telegram/methods/getMyCommands) | Use this method to get the current list of the bot's commands for the given scope and user language. |
| [setMyName](/telegram/methods/setMyName) | Use this method to change the bot's name. |
| [getMyName](/telegram/methods/getMyName) | Use this method to get the current bot name for the given user language. |
| [setMyDescription](/telegram/methods/setMyDescription) | Use this method to change the bot's description, which is shown in the chat with the bot if the chat is empty. |
| [getMyDescription](/telegram/methods/getMyDescription) | Use this method to get the current bot description for the given user language. |
| [setMyShortDescription](/telegram/methods/setMyShortDescription) | Use this method to change the bot's short description, which is shown on the bot's profile page and is sent together wit |
| [getMyShortDescription](/telegram/methods/getMyShortDescription) | Use this method to get the current bot short description for the given user language. |
| [setMyProfilePhoto](/telegram/methods/setMyProfilePhoto) | Changes the profile photo of the bot. |
| [removeMyProfilePhoto](/telegram/methods/removeMyProfilePhoto) | Removes the profile photo of the bot. |
| [setChatMenuButton](/telegram/methods/setChatMenuButton) | Use this method to change the bot's menu button in a private chat, or the default menu button. |
| [getChatMenuButton](/telegram/methods/getChatMenuButton) | Use this method to get the current value of the bot's menu button in a private chat, or the default menu button. |
| [setMyDefaultAdministratorRights](/telegram/methods/setMyDefaultAdministratorRights) | Use this method to change the default administrator rights requested by the bot when it's added as an administrator to g |
| [getMyDefaultAdministratorRights](/telegram/methods/getMyDefaultAdministratorRights) | Use this method to get the current default administrator rights of the bot. |
| [getAvailableGifts](/telegram/methods/getAvailableGifts) | Returns the list of gifts that can be sent by the bot to users and channel chats. |
| [sendGift](/telegram/methods/sendGift) | Sends a gift to the given user or channel chat. |
| [giftPremiumSubscription](/telegram/methods/giftPremiumSubscription) | Gifts a Telegram Premium subscription to the given user. |
| [verifyUser](/telegram/methods/verifyUser) | Verifies a user on behalf of the organization which is represented by the bot. |
| [verifyChat](/telegram/methods/verifyChat) | Verifies a chat on behalf of the organization which is represented by the bot. |
| [removeUserVerification](/telegram/methods/removeUserVerification) | Removes verification from a user who is currently verified on behalf of the organization represented by the bot. |
| [removeChatVerification](/telegram/methods/removeChatVerification) | Removes verification from a chat that is currently verified on behalf of the organization represented by the bot. |
| [readBusinessMessage](/telegram/methods/readBusinessMessage) | Marks incoming message as read on behalf of a business account. |
| [deleteBusinessMessages](/telegram/methods/deleteBusinessMessages) | Delete messages on behalf of a business account. |
| [setBusinessAccountName](/telegram/methods/setBusinessAccountName) | Changes the first and last name of a managed business account. |
| [setBusinessAccountUsername](/telegram/methods/setBusinessAccountUsername) | Changes the username of a managed business account. |
| [setBusinessAccountBio](/telegram/methods/setBusinessAccountBio) | Changes the bio of a managed business account. |
| [setBusinessAccountProfilePhoto](/telegram/methods/setBusinessAccountProfilePhoto) | Changes the profile photo of a managed business account. |
| [removeBusinessAccountProfilePhoto](/telegram/methods/removeBusinessAccountProfilePhoto) | Removes the current profile photo of a managed business account. |
| [setBusinessAccountGiftSettings](/telegram/methods/setBusinessAccountGiftSettings) | Changes the privacy settings pertaining to incoming gifts in a managed business account. |
| [getBusinessAccountStarBalance](/telegram/methods/getBusinessAccountStarBalance) | Returns the amount of Telegram Stars owned by a managed business account. |
| [transferBusinessAccountStars](/telegram/methods/transferBusinessAccountStars) | Transfers Telegram Stars from the business account balance to the bot's balance. |
| [getBusinessAccountGifts](/telegram/methods/getBusinessAccountGifts) | Returns the gifts received and owned by a managed business account. |
| [getUserGifts](/telegram/methods/getUserGifts) | Returns the gifts owned and hosted by a user. |
| [getChatGifts](/telegram/methods/getChatGifts) | Returns the gifts owned by a chat. |
| [convertGiftToStars](/telegram/methods/convertGiftToStars) | Converts a given regular gift to Telegram Stars. |
| [upgradeGift](/telegram/methods/upgradeGift) | Upgrades a given regular gift to a unique gift. |
| [transferGift](/telegram/methods/transferGift) | Transfers an owned unique gift to another user. |
| [postStory](/telegram/methods/postStory) | Posts a story on behalf of a managed business account. |
| [repostStory](/telegram/methods/repostStory) | Reposts a story on behalf of a business account from another business account. |
| [editStory](/telegram/methods/editStory) | Edits a story previously posted by the bot on behalf of a managed business account. |
| [deleteStory](/telegram/methods/deleteStory) | Deletes a story previously posted by the bot on behalf of a managed business account. |
| [editMessageText](/telegram/methods/editMessageText) | Use this method to edit text and game messages. |
| [editMessageCaption](/telegram/methods/editMessageCaption) | Use this method to edit captions of messages. |
| [editMessageMedia](/telegram/methods/editMessageMedia) | Use this method to edit animation, audio, document, photo, or video messages, or to add media to text messages. |
| [editMessageLiveLocation](/telegram/methods/editMessageLiveLocation) | Use this method to edit live location messages. |
| [stopMessageLiveLocation](/telegram/methods/stopMessageLiveLocation) | Use this method to stop updating a live location message before *live\_period* expires. |
| [editMessageChecklist](/telegram/methods/editMessageChecklist) | Use this method to edit a checklist on behalf of a connected business account. |
| [editMessageReplyMarkup](/telegram/methods/editMessageReplyMarkup) | Use this method to edit only the reply markup of messages. |
| [stopPoll](/telegram/methods/stopPoll) | Use this method to stop a poll which was sent by the bot. |
| [approveSuggestedPost](/telegram/methods/approveSuggestedPost) | Use this method to approve a suggested post in a direct messages chat. |
| [declineSuggestedPost](/telegram/methods/declineSuggestedPost) | Use this method to decline a suggested post in a direct messages chat. |
| [deleteMessage](/telegram/methods/deleteMessage) | Use this method to delete a message, including service messages, with the following limitations: |
| [deleteMessages](/telegram/methods/deleteMessages) | Use this method to delete multiple messages simultaneously. |
| [sendSticker](/telegram/methods/sendSticker) | Use this method to send static .WEBP, animated .TGS, or video .WEBM stickers. |
| [getStickerSet](/telegram/methods/getStickerSet) | Use this method to get a sticker set. |
| [getCustomEmojiStickers](/telegram/methods/getCustomEmojiStickers) | Use this method to get information about custom emoji stickers by their identifiers. |
| [uploadStickerFile](/telegram/methods/uploadStickerFile) | Use this method to upload a file with a sticker for later use in the createNewStickerSet, addStickerToSet, or replaceSti |
| [createNewStickerSet](/telegram/methods/createNewStickerSet) | Use this method to create a new sticker set owned by a user. |
| [addStickerToSet](/telegram/methods/addStickerToSet) | Use this method to add a new sticker to a set created by the bot. |
| [setStickerPositionInSet](/telegram/methods/setStickerPositionInSet) | Use this method to move a sticker in a set created by the bot to a specific position. |
| [deleteStickerFromSet](/telegram/methods/deleteStickerFromSet) | Use this method to delete a sticker from a set created by the bot. |
| [replaceStickerInSet](/telegram/methods/replaceStickerInSet) | Use this method to replace an existing sticker in a sticker set with a new one. |
| [setStickerEmojiList](/telegram/methods/setStickerEmojiList) | Use this method to change the list of emoji assigned to a regular or custom emoji sticker. |
| [setStickerKeywords](/telegram/methods/setStickerKeywords) | Use this method to change search keywords assigned to a regular or custom emoji sticker. |
| [setStickerMaskPosition](/telegram/methods/setStickerMaskPosition) | Use this method to change the mask position of a mask sticker. |
| [setStickerSetTitle](/telegram/methods/setStickerSetTitle) | Use this method to set the title of a created sticker set. |
| [setStickerSetThumbnail](/telegram/methods/setStickerSetThumbnail) | Use this method to set the thumbnail of a regular or mask sticker set. |
| [setCustomEmojiStickerSetThumbnail](/telegram/methods/setCustomEmojiStickerSetThumbnail) | Use this method to set the thumbnail of a custom emoji sticker set. |
| [deleteStickerSet](/telegram/methods/deleteStickerSet) | Use this method to delete a sticker set that was created by the bot. |
| [answerInlineQuery](/telegram/methods/answerInlineQuery) | Use this method to send answers to an inline query. |
| [answerWebAppQuery](/telegram/methods/answerWebAppQuery) | Use this method to set the result of an interaction with a Web App and send a corresponding message on behalf of the use |
| [savePreparedInlineMessage](/telegram/methods/savePreparedInlineMessage) | Stores a message that can be sent by a user of a Mini App. |
| [sendInvoice](/telegram/methods/sendInvoice) | Use this method to send invoices. |
| [createInvoiceLink](/telegram/methods/createInvoiceLink) | Use this method to create a link for an invoice. |
| [answerShippingQuery](/telegram/methods/answerShippingQuery) | If you sent an invoice requesting a shipping address and the parameter *is\_flexible* was specified, the Bot API will se |
| [answerPreCheckoutQuery](/telegram/methods/answerPreCheckoutQuery) | Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of |
| [getMyStarBalance](/telegram/methods/getMyStarBalance) | A method to get the current Telegram Stars balance of the bot. |
| [getStarTransactions](/telegram/methods/getStarTransactions) | Returns the bot's Telegram Star transactions in chronological order. |
| [refundStarPayment](/telegram/methods/refundStarPayment) | Refunds a successful payment in Telegram Stars. |
| [editUserStarSubscription](/telegram/methods/editUserStarSubscription) | Allows the bot to cancel or re-enable extension of a subscription paid in Telegram Stars. |
| [setPassportDataErrors](/telegram/methods/setPassportDataErrors) | Informs a user that some of the Telegram Passport elements they provided contains errors. |
| [sendGame](/telegram/methods/sendGame) | Use this method to send a game. |
| [setGameScore](/telegram/methods/setGameScore) | Use this method to set the score of the specified user in a game message. |
| [getGameHighScores](/telegram/methods/getGameHighScores) | Use this method to get data for high score tables. |
