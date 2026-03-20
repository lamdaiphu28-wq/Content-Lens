import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { db } from './lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Seed initial data if empty
const seedData = async () => {
  const snapshot = await getDocs(collection(db, 'products'));
  if (snapshot.empty) {
    const demoProducts = [
      {
        name: 'Lens Nâu Tự Nhiên Choco - Natural Brown',
        slug: 'lens-nau-tu-nhien-choco',
        brand: 'LENSBEAUTY',
        color: 'Nâu',
        dia: 14.2,
        bc: 8.6,
        power: '0.00 - 8.00',
        duration: '1 Tháng',
        price: 250000,
        category: 'tu-nhien',
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop'],
        shortDescription: 'Màu nâu choco tự nhiên, phù hợp đi học và đi làm hàng ngày.',
        createdAt: serverTimestamp(),
      },
      {
        name: 'Lens Xám Khói Quyến Rũ - Smoky Gray',
        slug: 'lens-xam-khoi-quyen-ru',
        brand: 'LENSBEAUTY',
        color: 'Xám',
        dia: 14.5,
        bc: 8.7,
        power: '0.00 - 6.00',
        duration: '3 Tháng',
        price: 320000,
        category: 'tay',
        images: ['https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=800&auto=format&fit=crop'],
        shortDescription: 'Màu xám khói cá tính, tạo điểm nhấn quyến rũ cho đôi mắt.',
        createdAt: serverTimestamp(),
      }
    ];
    for (const p of demoProducts) {
      await addDoc(collection(db, 'products'), p);
    }
  }
};

seedData().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
