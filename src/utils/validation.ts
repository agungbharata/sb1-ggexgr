import DOMPurify from 'dompurify';

export type InputType = 'name' | 'email' | 'phone' | 'message' | 'guestCount';

export const validateInput = (input: string, type: InputType): boolean => {
  switch(type) {
    case 'name':
      return /^[a-zA-Z\s]{2,50}$/.test(input);
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'phone':
      // Format: +62xxx atau 08xxx
      return /^([+]?62|0)[0-9]{9,12}$/.test(input);
    case 'message':
      return input.length >= 2 && input.length <= 500;
    case 'guestCount':
      return /^[1-9][0-9]?$/.test(input); // 1-99 guests
    default:
      return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
};

export const formatPhoneNumber = (phone: string): string => {
  // Convert 08xx to +62xx format
  if (phone.startsWith('0')) {
    return '+62' + phone.slice(1);
  }
  return phone;
};

export const validateForm = (formData: Record<string, string>): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!validateInput(formData.name, 'name')) {
    errors.name = 'Nama harus berupa huruf dan spasi (2-50 karakter)';
  }

  if (formData.email && !validateInput(formData.email, 'email')) {
    errors.email = 'Format email tidak valid';
  }

  if (!validateInput(formData.phone, 'phone')) {
    errors.phone = 'Nomor telepon tidak valid (format: 08xx atau +62xx)';
  }

  if (formData.guestCount && !validateInput(formData.guestCount, 'guestCount')) {
    errors.guestCount = 'Jumlah tamu harus antara 1-99';
  }

  if (formData.message && !validateInput(formData.message, 'message')) {
    errors.message = 'Pesan harus antara 2-500 karakter';
  }

  return errors;
};
