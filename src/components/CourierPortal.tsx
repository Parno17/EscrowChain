import React, { useState } from 'react';
import { AlertCircle, Camera, CheckCircle2, ImagePlus, MapPin, PackageCheck, Truck } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { OrderStatus } from '../types/escrow';

const MAX_SOURCE_PHOTO_SIZE = 10 * 1024 * 1024;
const MAX_COMPRESSED_PHOTO_SIZE = 580_000;

const prepareDeliveryPhoto = async (file: File): Promise<string> => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Gunakan foto JPG, PNG, atau WebP.');
  }
  if (file.size > MAX_SOURCE_PHOTO_SIZE) {
    throw new Error('Ukuran foto maksimal 10 MB.');
  }

  const image = await createImageBitmap(file);
  const scale = Math.min(1, 1280 / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext('2d');
  if (!context) {
    image.close();
    throw new Error('Browser tidak dapat memproses foto.');
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  const compressedPhoto = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Foto gagal dikompres.'));
    }, 'image/jpeg', 0.72);
  });
  if (compressedPhoto.size > MAX_COMPRESSED_PHOTO_SIZE) {
    throw new Error('Foto masih terlalu besar setelah dikompres. Pilih foto yang lebih kecil.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Foto tidak dapat dibaca.'));
    };
    reader.onerror = () => reject(new Error('Foto tidak dapat dibaca.'));
    reader.readAsDataURL(compressedPhoto);
  });
};

export const CourierPortal: React.FC = () => {
  const { activeAccount, orders, confirmCourierDelivery } = useWeb3();
  const [photos, setPhotos] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [error, setError] = useState<{ orderId: number; message: string } | null>(null);

  const shippedOrders = orders.filter(order => order.status === OrderStatus.Shipped);
  const pendingOrders = shippedOrders.filter(order => !order.courierDeliveryProof);

  const handlePhotoChange = async (orderId: number, file?: File) => {
    if (!file) return;
    setError(null);
    try {
      const photoDataUrl = await prepareDeliveryPhoto(file);
      setPhotos(current => ({ ...current, [orderId]: photoDataUrl }));
    } catch (photoError) {
      setError({
        orderId,
        message: photoError instanceof Error ? photoError.message : 'Foto gagal diproses.'
      });
    }
  };

  const handleConfirmDelivery = async (orderId: number) => {
    const photoDataUrl = photos[orderId];
    if (!photoDataUrl) {
      setError({ orderId, message: 'Unggah foto paket di lokasi penerima sebelum mengonfirmasi.' });
      return;
    }

    setProcessingId(orderId);
    setError(null);
    const result = await confirmCourierDelivery(orderId, photoDataUrl, notes[orderId]);
    setProcessingId(null);
    if (result.success) {
      setPhotos(current => {
        const next = { ...current };
        delete next[orderId];
        return next;
      });
    } else {
      setError({ orderId, message: result.error || 'Konfirmasi pengantaran gagal.' });
    }
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/60 to-slate-900 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-3 text-sky-300">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">Portal Kurir · {activeAccount.name}</p>
            <h1 className="mt-1 text-2xl font-bold text-white">Konfirmasi pengantaran</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
              Unggah foto paket di lokasi penerima—misalnya saat paket diletakkan di depan pintu—agar pembeli dapat melihat bukti pengiriman.
              Foto ini hanya bukti di prototipe lokal, bukan konfirmasi resmi dari J&amp;T atau ekspedisi lain.
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 text-xs">
        <span className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300">
          {pendingOrders.length} pengantaran menunggu bukti
        </span>
        <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-300">
          {shippedOrders.length - pendingOrders.length} bukti sudah dikirim
        </span>
      </div>

      {shippedOrders.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
          <PackageCheck className="mx-auto h-10 w-10 text-slate-600" />
          <h2 className="mt-3 font-semibold text-white">Belum ada paket dalam pengiriman</h2>
          <p className="mt-1 text-sm text-slate-400">Pesanan akan tampil di sini setelah penjual memasukkan resi dan mengubah statusnya menjadi dikirim.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {shippedOrders.map(order => {
            const proof = order.courierDeliveryProof;
            return (
              <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-4">
                  <div>
                    <p className="font-mono text-xs font-bold text-sky-300">Pesanan #{order.id} · {order.courierTracking}</p>
                    <h2 className="mt-1 font-semibold text-white">{order.productName || order.desc}</h2>
                    <p className="mt-1 text-xs text-slate-400">{order.courierName || 'Kurir'} · Penerima {order.buyer.slice(0, 8)}…</p>
                  </div>
                  <Truck className="h-5 w-5 shrink-0 text-slate-500" />
                </div>

                {proof ? (
                  <div className="space-y-3 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      Foto bukti pengantaran sudah dikirim
                    </div>
                    <img src={proof.photoDataUrl} alt={`Bukti paket pesanan ${order.id} di lokasi penerima`} className="max-h-72 w-full rounded-xl border border-slate-700 object-contain bg-slate-950" />
                    <div className="text-xs text-slate-400">
                      <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{proof.deliveryNote || 'Paket diletakkan di depan pintu penerima.'}</p>
                      <p className="mt-1">Dikonfirmasi oleh {proof.deliveredBy} · {new Date(proof.deliveredAt).toLocaleString('id-ID')}</p>
                    </div>
                    <p className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs leading-relaxed text-amber-200">
                      Bukti diterima pembeli; escrow belum diselesaikan otomatis. Pembeli tetap perlu memeriksa paket dan mengonfirmasi penerimaan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 p-4">
                    <label className="block text-xs font-medium text-slate-300">
                      Foto paket di depan pintu / lokasi penerima
                      <span className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-sky-500/40 bg-sky-500/5 px-4 py-6 text-sky-200 hover:bg-sky-500/10">
                        <ImagePlus className="h-5 w-5" />
                        <span>Pilih foto (JPG, PNG, WebP · maks. 10 MB)</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          capture="environment"
                          className="sr-only"
                          onChange={event => {
                            void handlePhotoChange(order.id, event.target.files?.[0]);
                            event.target.value = '';
                          }}
                        />
                      </span>
                    </label>

                    {photos[order.id] && (
                      <img src={photos[order.id]} alt={`Pratinjau bukti pesanan ${order.id}`} className="max-h-64 w-full rounded-xl border border-slate-700 object-contain bg-slate-950" />
                    )}

                    <label className="block text-xs font-medium text-slate-300">
                      Catatan pengantaran
                      <input
                        type="text"
                        maxLength={200}
                        value={notes[order.id] || ''}
                        onChange={event => setNotes(current => ({ ...current, [order.id]: event.target.value }))}
                        placeholder="Contoh: Paket diletakkan di depan pintu sesuai instruksi."
                        className="mt-1.5 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
                      />
                    </label>

                    {error?.orderId === order.id && (
                      <p role="alert" className="flex items-center gap-2 text-xs text-rose-300">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error.message}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => void handleConfirmDelivery(order.id)}
                      disabled={processingId === order.id || !photos[order.id]}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Camera className="h-4 w-4" />
                      {processingId === order.id ? 'Menyimpan bukti…' : 'Konfirmasi paket telah tiba'}
                    </button>
                    <p className="text-[11px] leading-relaxed text-slate-500">Konfirmasi ini mencatat foto dan waktu di simulasi aplikasi. Bukti foto tidak ditulis ke blockchain.</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
