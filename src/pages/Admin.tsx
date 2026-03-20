import React from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { generateSEOContent, SEOContentResult } from '../services/geminiService';
import { generateSlug, cn } from '../lib/utils';
import { Plus, Trash2, Edit2, Sparkles, Loader2, Save, X, Eye } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';

interface ProductForm {
  name: string;
  brand: string;
  color: string;
  dia: number;
  bc: number;
  power: string;
  duration: string;
  price: number;
  category: string;
  images: string[];
  shortDescription: string;
  seoTitle?: string;
  metaDescription?: string;
  slug?: string;
  content?: string;
  faqs?: { question: string; answer: string }[];
}

const INITIAL_FORM: ProductForm = {
  name: '',
  brand: 'LENSBEAUTY',
  color: 'Nâu',
  dia: 14.2,
  bc: 8.6,
  power: '0.00 - 8.00',
  duration: '1 Tháng',
  price: 250000,
  category: 'tu-nhien',
  images: ['https://picsum.photos/seed/lens1/800/1000'],
  shortDescription: '',
};

export default function Admin() {
  const [user, setUser] = React.useState<User | null>(null);
  const [products, setProducts] = React.useState<any[]>([]);
  const [form, setForm] = React.useState<ProductForm>(INITIAL_FORM);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    onAuthStateChanged(auth, (u) => setUser(u));
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleGenerateSEO = async () => {
    if (!form.name) return alert('Vui lòng nhập tên sản phẩm');
    setIsGenerating(true);
    try {
      const result = await generateSEOContent({
        name: form.name,
        brand: form.brand,
        color: form.color,
        dia: form.dia,
        bc: form.bc,
        power: form.power,
        duration: form.duration,
        price: form.price,
      });
      setForm(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error(error);
      alert('Lỗi khi tạo nội dung SEO');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = {
        ...form,
        slug: form.slug || generateSlug(form.name),
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), data);
      } else {
        await addDoc(collection(db, 'products'), {
          ...data,
          createdAt: serverTimestamp(),
        });
      }
      
      setForm(INITIAL_FORM);
      setEditingId(null);
      fetchProducts();
      alert('Đã lưu sản phẩm thành công!');
    } catch (error) {
      console.error(error);
      alert('Lỗi khi lưu sản phẩm');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  const handleEdit = (p: any) => {
    setForm(p);
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (user?.email !== 'lamdaiphu28@gmail.com') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Truy cập bị từ chối</h2>
          <p className="text-gray-500">Bạn không có quyền truy cập trang quản trị này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Form Section */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-[#F5E6E0] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">
              {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            {editingId && (
              <button onClick={() => { setEditingId(null); setForm(INITIAL_FORM); }} className="text-gray-400 hover:text-red-500">
                <X size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Tên sản phẩm</label>
                <input 
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors"
                  placeholder="VD: Lens Nâu Tự Nhiên Choco"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Thương hiệu</label>
                <input 
                  value={form.brand}
                  onChange={e => setForm({ ...form, brand: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Màu sắc</label>
                <select 
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors"
                >
                  <option>Nâu</option>
                  <option>Đen</option>
                  <option>Xám</option>
                  <option>Xanh</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Giá (VND)</label>
                <input 
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">DIA (Đường kính)</label>
                <input 
                  type="number" step="0.1"
                  value={form.dia}
                  onChange={e => setForm({ ...form, dia: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Thời gian sử dụng</label>
                <input 
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Mô tả ngắn</label>
              <textarea 
                value={form.shortDescription}
                onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors h-24"
                placeholder="Mô tả ngắn gọn về sản phẩm..."
              />
            </div>

            <div className="flex items-center gap-4 py-4">
              <button 
                type="button"
                onClick={handleGenerateSEO}
                disabled={isGenerating}
                className="flex-1 bg-[#F5E6E0] text-[#D4A373] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#D4A373] hover:text-white transition-all disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                TẠO NỘI DUNG SEO BẰNG AI
              </button>
            </div>

            {form.content && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">SEO Title</label>
                  <input 
                    value={form.seoTitle}
                    onChange={e => setForm({ ...form, seoTitle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Meta Description</label>
                  <textarea 
                    value={form.metaDescription}
                    onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors h-20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nội dung SEO (Markdown)</label>
                  <textarea 
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#F5E6E0] focus:border-[#D4A373] outline-none transition-colors h-96 font-mono text-sm"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#D4A373] transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {editingId ? 'CẬP NHẬT SẢN PHẨM' : 'LƯU SẢN PHẨM'}
            </button>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Danh sách sản phẩm</h2>
        <div className="space-y-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#F5E6E0] flex items-center gap-4 group">
              <img src={p.images[0]} className="w-16 h-16 rounded-lg object-cover" alt={p.name} />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate">{p.name}</h4>
                <p className="text-xs text-gray-400">{new Intl.NumberFormat('vi-VN').format(p.price)}đ</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(p)} className="p-2 text-gray-400 hover:text-[#D4A373]"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
