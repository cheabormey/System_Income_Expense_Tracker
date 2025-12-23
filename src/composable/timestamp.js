import API_CONFIGS from '@/api/config';
import axios from 'axios';


// Function to fetch the current timestamp from the server
export const fetchTimestamp = async () => {
    try {
        const response = await axios.get(`${API_CONFIGS.BASE_URL}/api/timestamp`, { headers: API_CONFIGS.headers });
        return response.data.timestamp;
    } catch (error) {
        console.error('Error fetching timestamp:', error);
        return null;
    }
};

