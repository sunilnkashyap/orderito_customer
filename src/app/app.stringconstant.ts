export const APP_NAME = "Orderito Customer";
export const IS_PRODUCTION = true;
export const IS_DEMO = false;

const BASE_URL = IS_PRODUCTION ? "https://orderito.net/dev/" : "http://localhost/jayanta/orderito.net/";

const API_URL = IS_PRODUCTION ? BASE_URL+"webservice_ionic/customerApp" : BASE_URL+"webservice_ionic/customerApp";

export const StringConstant = {
    IS_PRODUCTION:IS_PRODUCTION,
    API_URL:API_URL,
    BASE_URL:BASE_URL,

    login_email:!IS_DEMO ? "":"earthtechnology9@gmail.com" ,
    login_password:!IS_DEMO ? "":"123456",

    currencySign: 'د.ع',
    distanceUnit: 'mi',
    mapRouteColor: '#363333',
    mapRoutestroke: 4,
    language: 'en',
    myLAT: '25.276987',
    myLONG: '55.296249',
    myCOUNTRY: 'CAD',
    myTOKEN: '138ynmb-2378qnHH72yh(JDC2678UK52NB!48a',
    myPOSTCODE_REGEXP: '([0-9]){5}',
    myNUMBER_REGEXP: '[0-9]{10}',
     //myNUMBER_REGEXP: '\(?\+\(?49\)?[ ()]?([- ()]?\d[- ()]?){10}',
    myEMAIL_REGEXP: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
    //myPHONE_REGEXP: '/^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/',

    myCARD_REGEXP: '[0-9]{16}',
    myCVV_REGEXP: '[0-9]{3,4}',
    myNUMBER_ONLY_REGEXP: '[0-9]*',

    defaultUserImg: "assets/img/default.jpg",
    PUSH_SENDER_ID: "7982499056",
    DEVICE_PUSH_ID: "DEVICE_PUSH_ID",
    NOTIFICATIO_PAYLOAD: "NOTIFICATIO_PAYLOAD",
    STRIPE_KEY: "pk_test_3BsdUPpinnmnqoIb4WJz28Rv",
    GOOGLE_LOGIN_webClientId: "288782489622-12199l83ln74j4894sh8sb4ir4mogn9s.apps.googleusercontent.com"
};

export const HAS_MULTI_LANGUAGE = false;
export const DEFAULT_LANG = 'en';
export const LNG_KEY = 'SELECTED_LANGUAGE';
export const APP_LANGUAGES = [
    {value:"en", text:"English"},
    {value:"es", text:"Spanish"}
];
export const API_RESPONSE = {
    TYPE: "type",
    MESSAGE: "message",
    OK: "1",
    ERROR: "0",
    PROBLEM_IN_API: "api_error",
    SUCCESS: "success",
};
export const USER = {
    USER_ID: "USER_ID",
    USER_DETAILS: "USER_DETAILS",
};
export const ORDER_STATUS = {
    PENDING: "Pending",
    IN_PREPARATION: "In Preparation",
    OUT_FOR_DELIVERY: "Out for delivery",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    REJECTED: "Rejected",
    MISSED: "Missed",
    FAILED: "failed"
};

export const SERVICE_MODE = {
    PICKUP: "pickup",
    DINEIN: "dinein",
    DELIVERY: "delivery",
    pickup: "Pickup",
    dinein: "Dinein",
    delivery: "Delivery"
};
