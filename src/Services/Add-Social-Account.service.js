import {api} from "./Api";

export const fetchCsvCredentials = async(csvData) => {
    const response = await api.post("/instagram/csv-credentials", csvData);
    return response.data;
};

export const submitManualCredentials = async(credentials) => {
    const response = await api.post("/instagram/manual-credentials", credentials);
    return response.data;
};

