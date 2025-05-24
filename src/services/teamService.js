import httpRequest from '~/utils/httpRequest';
import { normalizeImageUrl } from '~/utils/imageUtils';

// Helper functions for sessionStorage
const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
};

const getFromSessionStorage = (key) => {
    const storedData = sessionStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
};

// Members
export const getMembers = async () => {
    const sessionKey = 'allMembers';

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        console.log('[teamService] Using cached team members data');
        return cachedData;
    }

    try {
        console.log('[teamService] Fetching fresh team members data from API...');
        const response = await httpRequest.get('/teams');
        const membersData = response.data.data;
        
        console.log(`[teamService] Received ${membersData.length} team members from API`);
        
        // Normalize image URLs for all members
        const normalizedMembers = membersData.map(member => {
            const processedMember = {
                ...member,
                image: normalizeImageUrl(member.image || member.avatar),
                avatar: normalizeImageUrl(member.avatar || member.image)
            };
            
            console.log(`[teamService] Member ${member.name} - Original: ${member.image}, Normalized: ${processedMember.image}`);
            return processedMember;
        });

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, normalizedMembers);
        console.log(`[teamService] Cached ${normalizedMembers.length} team members in sessionStorage`);

        return normalizedMembers;
    } catch (error) {
        console.error('[teamService] Error fetching members', error);
        throw error;
    }
};

export const addMember = async (memberData) => {
    try {
        const response = await httpRequest.post(`/teams`, memberData);

        sessionStorage.removeItem(`allMembers`);

        // Refresh sessionStorage for all services list
        const updateMember = await getMembers();
        saveToSessionStorage('allMembers', updateMember);

        return response.data.data;
    } catch (error) {
        console.error('Error adding member', error);
        throw error;
    }
};

export const updateMember = async (memberId, memberData) => {
    try {
        const response = await httpRequest.post(`/teams/${memberId}`, memberData);

        sessionStorage.removeItem(`member_${memberId}`);
        sessionStorage.removeItem(`allMembers`);

        // Refresh sessionStorage for all services list
        const updateMember = await getMembers();
        saveToSessionStorage('allMembers', updateMember);

        return response.data;
    } catch (error) {
        console.error('Error updating member', error);
        throw error;
    }
};

export const getMemberById = async (memberId) => {
    const sessionKey = `member_${memberId}`;

    const cachedData = getFromSessionStorage(sessionKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await httpRequest.get(`/teams/${memberId}`);
        const memberData = response.data.data;

        // Save to sessionStorage
        saveToSessionStorage(sessionKey, memberData);

        return memberData;
    } catch (error) {
        console.error('Error fetching member detail', error);
        throw error;
    }
};

export const deleteMember = async (memberId) => {
    try {
        await httpRequest.delete(`/teams/${memberId}`);

        sessionStorage.removeItem(`allMembers`);
        sessionStorage.removeItem(`member_${memberId}`);

        // Refresh sessionStorage for all services list
        const updateMember = await getMembers();
        saveToSessionStorage('allMembers', updateMember);
    } catch (error) {
        console.error('Error deleting member', error);
        throw error;
    }
};
