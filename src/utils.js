import PubNub from 'pubnub';

export const connectToPubnub = (userId) => {

    const pubnub = new PubNub({
        publishKey: 'pub-c-0a4c102e-d8c7-49ba-80fe-d13b3e6ddd5e',
        subscribeKey: 'sub-c-06546e42-6ace-4a92-ab1c-99b4886bf66f',
        uuid: userId
    });
    return pubnub
}