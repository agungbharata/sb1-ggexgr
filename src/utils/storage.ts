import type { InvitationData } from '../types';

const LOCAL_STORAGE_KEY = 'invitations';
const SESSION_STORAGE_KEY = 'temp_invitations';
const MAX_STORAGE_PERCENTAGE = 90; // Maximum storage usage percentage allowed

// Compress base64 string by removing metadata
const compressBase64 = (base64: string): string => {
  if (!base64) return '';
  // Remove data URL metadata if exists
  const base64Data = base64.split(',')[1] || base64;
  return base64Data;
};

// Decompress base64 string by adding back metadata
const decompressBase64 = (compressedBase64: string, mimeType: string = 'image/jpeg'): string => {
  if (!compressedBase64) return '';
  if (compressedBase64.startsWith('data:')) return compressedBase64;
  return `data:${mimeType};base64,${compressedBase64}`;
};

// Compress invitation data
const compressInvitation = (invitation: InvitationData): InvitationData => {
  return {
    ...invitation,
    coverPhoto: invitation.coverPhoto ? compressBase64(invitation.coverPhoto) : undefined,
    bridePhoto: invitation.bridePhoto ? compressBase64(invitation.bridePhoto) : undefined,
    groomPhoto: invitation.groomPhoto ? compressBase64(invitation.groomPhoto) : undefined,
    gallery: invitation.gallery?.map(img => compressBase64(img)) || [],
    backgroundMusic: invitation.backgroundMusic ? compressBase64(invitation.backgroundMusic) : undefined,
  };
};

// Decompress invitation data
const decompressInvitation = (invitation: InvitationData): InvitationData => {
  return {
    ...invitation,
    coverPhoto: invitation.coverPhoto ? decompressBase64(invitation.coverPhoto) : undefined,
    bridePhoto: invitation.bridePhoto ? decompressBase64(invitation.bridePhoto) : undefined,
    groomPhoto: invitation.groomPhoto ? decompressBase64(invitation.groomPhoto) : undefined,
    gallery: invitation.gallery?.map(img => decompressBase64(img)) || [],
    backgroundMusic: invitation.backgroundMusic ? decompressBase64(invitation.backgroundMusic, 'audio/mpeg') : undefined,
  };
};

// Fungsi untuk mendapatkan info storage
export const getStorageInfo = (storageType: 'local' | 'session' = 'local') => {
  const storage = storageType === 'local' ? localStorage : sessionStorage;
  const total = 5 * 1024 * 1024; // Approximate storage limit (5MB)
  const used = new Blob([storage.getItem(storageType === 'local' ? LOCAL_STORAGE_KEY : SESSION_STORAGE_KEY) || '']).size;
  const percentage = (used / total) * 100;
  return { used, total, percentage };
};

export const isStorageCritical = (storageType: 'local' | 'session' = 'local') => {
  const { percentage } = getStorageInfo(storageType);
  return percentage > MAX_STORAGE_PERCENTAGE;
};

// Fungsi untuk menyimpan data sementara di session storage
export const saveTemporaryInvitation = async (invitation: InvitationData): Promise<void> => {
  try {
    // Cek kapasitas session storage
    if (isStorageCritical('session')) {
      // Jika session storage penuh, coba bersihkan dulu
      clearTemporaryInvitations();
      
      // Cek lagi setelah pembersihan
      if (isStorageCritical('session')) {
        // Jika masih penuh, coba simpan langsung ke localStorage
        try {
          const existingInvitations = loadInvitations();
          const updatedInvitations = existingInvitations.map(inv => 
            inv.id === invitation.id ? invitation : inv
          );
          
          if (!updatedInvitations.find(inv => inv.id === invitation.id)) {
            updatedInvitations.push(invitation);
          }
          
          await saveInvitations(updatedInvitations);
          return;
        } catch (error) {
          console.error('Failed to save directly to localStorage:', error);
          throw new Error('Tidak dapat menyimpan data karena storage penuh');
        }
      }
    }

    // Ambil data temporary yang ada
    const tempInvitations = loadTemporaryInvitations();
    const existingIndex = tempInvitations.findIndex(inv => inv.id === invitation.id);
    
    // Update atau tambah undangan baru
    if (existingIndex !== -1) {
      tempInvitations[existingIndex] = invitation;
    } else {
      tempInvitations.push(invitation);
    }

    // Kompresi dan simpan
    const compressedInvitations = tempInvitations.map(compressInvitation);
    const serialized = JSON.stringify(compressedInvitations);
    
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
      
      // Verifikasi penyimpanan
      const savedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (savedData !== serialized) {
        throw new Error('Verifikasi gagal: Data tersimpan tidak sesuai');
      }
    } catch (storageError) {
      console.error('Session storage error:', storageError);
      
      // Jika gagal simpan ke session storage, coba simpan ke local storage
      const existingInvitations = loadInvitations();
      const updatedInvitations = existingInvitations.map(inv => 
        inv.id === invitation.id ? invitation : inv
      );
      
      if (!updatedInvitations.find(inv => inv.id === invitation.id)) {
        updatedInvitations.push(invitation);
      }
      
      await saveInvitations(updatedInvitations);
    }
  } catch (error) {
    console.error('Error in saveTemporaryInvitation:', error);
    throw new Error('Gagal menyimpan data sementara: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
};

// Fungsi untuk memindahkan data dari temporary ke permanent storage
export const commitTemporaryInvitations = async (): Promise<void> => {
  try {
    // Cek apakah ada data temporary
    const tempInvitations = loadTemporaryInvitations();
    if (tempInvitations.length === 0) return;

    // Ambil data permanent yang ada
    const permanentInvitations = loadInvitations();
    
    // Update atau tambah undangan dari temporary ke permanent
    const updatedInvitations = [...permanentInvitations];
    let hasChanges = false;
    
    for (const tempInv of tempInvitations) {
      const existingIndex = updatedInvitations.findIndex(inv => inv.id === tempInv.id);
      if (existingIndex !== -1) {
        if (JSON.stringify(updatedInvitations[existingIndex]) !== JSON.stringify(tempInv)) {
          updatedInvitations[existingIndex] = tempInv;
          hasChanges = true;
        }
      } else {
        updatedInvitations.push(tempInv);
        hasChanges = true;
      }
    }

    // Hanya simpan jika ada perubahan
    if (hasChanges) {
      // Coba simpan ke permanent storage
      await saveInvitations(updatedInvitations);
    }
    
    // Jika berhasil, bersihkan temporary storage
    clearTemporaryInvitations();
  } catch (error) {
    console.error('Error in commitTemporaryInvitations:', error);
    // Jangan hapus temporary storage jika gagal commit
    throw error;
  }
};

// Fungsi untuk membersihkan semua data sementara
export const clearTemporaryInvitations = (): void => {
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
};

// Fungsi untuk memuat data sementara dari session storage
export const loadTemporaryInvitations = (): InvitationData[] => {
  try {
    const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return [];
    const compressedInvitations = JSON.parse(data);
    return compressedInvitations.map(decompressInvitation);
  } catch (error) {
    console.error('Error loading temporary invitations:', error);
    return [];
  }
};

// Fungsi untuk menghapus data sementara spesifik
export const removeTemporaryInvitation = (id: string): void => {
  try {
    const tempInvitations = loadTemporaryInvitations();
    const filteredInvitations = tempInvitations.filter(inv => inv.id !== id);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(filteredInvitations.map(compressInvitation)));
  } catch (error) {
    console.error('Error removing temporary invitation:', error);
  }
};

// Fungsi untuk cleanup storage
export const cleanupStorage = (daysThreshold: number = 30, forceCleanup: boolean = false) => {
  const invitations = loadInvitations();
  const now = new Date();
  
  invitations.sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.date);
    const dateB = new Date(b.updatedAt || b.date);
    return dateA.getTime() - dateB.getTime();
  });

  let deletedCount = 0;
  const cleanedInvitations = invitations.filter(inv => {
    const updatedAt = new Date(inv.updatedAt || inv.date);
    const daysDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 3600 * 24);
    
    if (isStorageCritical() || forceCleanup) {
      if (daysDiff > 7) {
        deletedCount++;
        return false;
      }
    } else if (daysDiff > daysThreshold) {
      deletedCount++;
      return false;
    }
    return true;
  });

  if (deletedCount > 0) {
    saveInvitations(cleanedInvitations);
  }

  return {
    cleanedCount: deletedCount,
    remainingCount: cleanedInvitations.length,
    storageInfo: getStorageInfo()
  };
};

// Fungsi untuk menyimpan ke permanent storage
export const saveInvitations = async (invitations: InvitationData[]): Promise<void> => {
  try {
    if (isStorageCritical()) {
      const { cleanedCount, storageInfo } = cleanupStorage(7, true);
      
      if (storageInfo.percentage > MAX_STORAGE_PERCENTAGE) {
        throw new Error(
          `Storage is critically full (${storageInfo.percentage.toFixed(1)}%). ` +
          `Cleaned ${cleanedCount} old invitations but still need more space. ` +
          'Please manually delete some invitations.'
        );
      }
    }

    const serialized = JSON.stringify(invitations.map(compressInvitation));
    localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
    
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData !== serialized) {
      throw new Error('Verification failed: Saved data does not match original data');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to save: ${error.message}`);
    }
    throw new Error('Failed to save: Unknown error occurred');
  }
};

// Fungsi untuk memuat dari permanent storage
export const loadInvitations = (): InvitationData[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    const compressedInvitations = data ? JSON.parse(data) : [];
    return compressedInvitations.map(decompressInvitation);
  } catch (error) {
    console.error('Error loading invitations:', error);
    return [];
  }
};

export const clearOldInvitations = (days: number = 30): void => {
  cleanupStorage(days);
};
