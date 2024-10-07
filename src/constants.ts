// Check if the app is running in production

export const SERVER_HOST = process.env.REACT_APP_API_GATEWAY_HOST
export const SERVER_PORT = process.env.REACT_APP_API_GATEWAY_PORT

export const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

export const URL = '';


// BuildACPage.tsx
export const AI_MODEL_TYPES = ['Neural Network', 'XGBoost', 'LightGBM']
export const FEATURE_OPTIONS = ['Raw']
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
