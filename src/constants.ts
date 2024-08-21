// Check if the app is running in production
const isProduction = process.env.NODE_ENV === 'production';

// Local configuration
export const LOCAL_HOST = "127.0.0.1";
export const LOCAL_PORT = 31057;

// Production configuration
export const SERVER_HOST = process.env.SERVER_HOST || "193.40.154.143";
export const SERVER_PORT = process.env.SERVER_PORT || 8000;
// export const WITHSECURE_HOST = process.env.WITHSECURE_HOST || "193.40.154.143";

// Determine the URLs based on environment
export const LOCAL_URL = `http://${LOCAL_HOST}:${LOCAL_PORT}`;
export const SERVER_URL = isProduction
    ? `http://${SERVER_HOST}:${SERVER_PORT}`
    : LOCAL_URL;

// export const WITHSECURE_URL = isProduction
//     ? `http://${WITHSECURE_HOST}`
//     : LOCAL_URL;



// BuildACPage.tsx
export const AI_MODEL_TYPES = ['Neural Network', 'XGBoost', 'LightGBM']
export const FEATURE_OPTIONS =  ['Raw']
export const AD_OUTPUT_LABELS = ["Normal traffic", "Malware traffic"];
export const AD_OUTPUT_LABELS_SHORT = ["Normal", "Malware"];
export const AD_OUTPUT_LABELS_XAI = ["", "Malware"];
export const AC_OUTPUT_LABELS = ["Web", "Interactive", "Video"];

export const HEADER_ACCURACY_STATS = ["precision", "recall", "f1score", "support"];

export const CRITERIA_LIST = [
    "Build Configuration",
    "Model Performance",
    "Confusion Matrix",
    "XAI Result",
    "Fairness"
];

export const ATTACK_DATASETS_MAPPING = {
    'rsl_poisoned_dataset.csv': 'Random swapping labels',
    'tlf_poisoned_dataset.csv': 'Target labels flipping',
    'ctgan_poisoned_dataset.csv': 'GAN-driven data poisoing'
};
