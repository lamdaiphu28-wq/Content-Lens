import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface SEOContentResult {
  seoTitle: string;
  metaDescription: string;
  slug: string;
  content: string;
  faqs: { question: string; answer: string }[];
}

export async function generateSEOContent(productData: {
  name: string;
  brand: string;
  color: string;
  dia: number;
  bc: number;
  power: string;
  duration: string;
  price: number;
}): Promise<SEOContentResult> {
  const prompt = `
    Bạn là một chuyên gia SEO và Content Marketing hàng đầu cho ngành làm đẹp và kính áp tròng (lens mắt).
    Hãy viết nội dung SEO cho sản phẩm sau:
    - Tên: ${productData.name}
    - Thương hiệu: ${productData.brand}
    - Màu sắc: ${productData.color}
    - DIA: ${productData.dia}
    - BC: ${productData.bc}
    - Độ cận: ${productData.power}
    - Thời gian sử dụng: ${productData.duration}
    - Giá: ${productData.price} VND

    Yêu cầu:
    1. SEO Title: 60-70 ký tự, chứa từ khóa chính.
    2. Meta Description: 150-160 ký tự, hấp dẫn, có CTA.
    3. Slug: URL chuẩn SEO không dấu.
    4. Nội dung bài viết (1000-1500 từ):
       - Mở bài hấp dẫn (hook), đánh vào insight khách hàng muốn đẹp tự nhiên, an toàn.
       - Giới thiệu chi tiết sản phẩm.
       - Lợi ích nổi bật (êm ái, giữ ẩm, màu sắc thời thượng).
       - Hướng dẫn sử dụng và bảo quản.
       - So sánh nhẹ với các dòng khác để làm nổi bật sản phẩm này.
       - CTA mạnh mẽ.
       - Sử dụng các thẻ H1, H2, H3.
       - Phong cách viết giống Shopee/TikTok viral, thân thiện, dễ đọc, không robotic.
    5. FAQ: 3-5 câu hỏi thường gặp về sản phẩm này.

    Trả về kết quả dưới dạng JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          seoTitle: { type: Type.STRING },
          metaDescription: { type: Type.STRING },
          slug: { type: Type.STRING },
          content: { type: Type.STRING, description: "Nội dung bài viết chuẩn SEO định dạng Markdown" },
          faqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answer: { type: Type.STRING }
              },
              required: ["question", "answer"]
            }
          }
        },
        required: ["seoTitle", "metaDescription", "slug", "content", "faqs"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
