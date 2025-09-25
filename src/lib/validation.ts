import { z } from 'zod';

// URL validation regex
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Phone number validation (Turkish format)
const phoneRegex = /^\+?[0-9\s\-\(\)]{10,15}$/;

// Email validation
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const basicInfoSchema = z.object({
  name_tr: z.string()
    .trim()
    .min(1, { message: "İşletme adı gereklidir" })
    .max(100, { message: "İşletme adı en fazla 100 karakter olabilir" }),
  name_en: z.string()
    .trim()
    .max(100, { message: "İngilizce isim en fazla 100 karakter olabilir" })
    .optional()
});

export const contactInfoSchema = z.object({
  shop_number: z.string()
    .trim()
    .max(20, { message: "Dükkan numarası en fazla 20 karakter olabilir" })
    .optional(),
  phone: z.string()
    .trim()
    .min(1, { message: "Telefon numarası gereklidir" })
    .regex(phoneRegex, { message: "Geçerli bir telefon numarası giriniz" }),
  email: z.string()
    .trim()
    .regex(emailRegex, { message: "Geçerli bir e-posta adresi giriniz" })
    .max(255, { message: "E-posta adresi en fazla 255 karakter olabilir" })
    .optional()
    .or(z.literal("")),
  whatsapp: z.string()
    .trim()
    .regex(phoneRegex, { message: "Geçerli bir WhatsApp numarası giriniz" })
    .optional()
    .or(z.literal("")),
  website: z.string()
    .trim()
    .regex(urlRegex, { message: "Geçerli bir website URL'si giriniz (http:// veya https:// ile başlamalı)" })
    .max(500, { message: "Website URL'si en fazla 500 karakter olabilir" })
    .optional()
    .or(z.literal("")),
  instagram: z.string()
    .trim()
    .max(100, { message: "Instagram hesabı en fazla 100 karakter olabilir" })
    .optional()
    .or(z.literal("")),
  facebook: z.string()
    .trim()
    .max(100, { message: "Facebook hesabı en fazla 100 karakter olabilir" })
    .optional()
    .or(z.literal("")),
  twitter: z.string()
    .trim()
    .max(100, { message: "Twitter hesabı en fazla 100 karakter olabilir" })
    .optional()
    .or(z.literal("")),
  linkedin: z.string()
    .trim()
    .max(100, { message: "LinkedIn hesabı en fazla 100 karakter olabilir" })
    .optional()
    .or(z.literal(""))
});

export const descriptionSchema = z.object({
  description_tr: z.string()
    .trim()
    .max(1000, { message: "Açıklama en fazla 1000 karakter olabilir" })
    .optional()
    .or(z.literal(""))
});

// Validation helper function
export const validateInput = <T>(schema: z.ZodSchema<T>, data: any): { success: boolean; errors?: Record<string, string>; data?: T } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: "Validation failed" } };
  }
};