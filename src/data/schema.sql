-- === TABLE: categories (Master Data) ===
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,  -- contoh: "Pasangan", "Teman"
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- === TABLE: questions ===
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, description)
VALUES 
  ('Teman', 'Pertanyaan yang memicu obrolan seru antar teman.'),
  ('Pasangan', 'Pertanyaan untuk memperdalam hubungan dengan pasangan.');

-- 🔹 Untuk kategori Teman
INSERT INTO questions (category_id, title) VALUES
(1, 'Apa mimpi terliar kita yang belum tercapai?'),
(1, 'Siapa yang paling jago menghadapi masalah dalam grup?'),
(1, 'Jika kita jadi karakter serial TV, peran apa yang cocok untuk masing-masing?'),
(1, 'Apa kebohongan putih yang pernah kamu lakukan untuk teman?'),
(1, 'Kalau grup kita punya motto, kira-kira apa?'),
(1, 'Siapa yang paling mungkin jadi influencer TikTok?'),
(1, 'Apa permainan papan yang selalu memicu persaingan sengit?'),
(1, 'Jika ada satu anggota yang bisa jadi alien, siapa kandidatnya?'),
(1, 'Apa tradisi konyol yang hanya dimengerti oleh kita?'),
(1, 'Siapa yang akan jadi detektif terbaik di antara kita?'),
(1, 'Apa momen paling memalukan yang kita alami bersama?'),
(1, 'Jika kita bisa kolaborasi dengan artis, lagu apa yang akan kita cover?'),
(1, 'Apa hadiah terburuk yang pernah kita tukarkan?'),
(1, 'Siapa yang paling sering jadi "korban" lelucon kita?'),
(1, 'Apa hobi baru yang ingin kita coba bersama?'),
(1, 'Jika grup kita punya menu signature di kafe, apa namanya?'),
(1, 'Apa kesamaan teraneh antara kita semua?'),
(1, 'Siapa yang akan jadi survivor jika zombie apocalypse terjadi?'),
(1, 'Apa momen di mana kamu merasa sangat bersyukur punya teman seperti kami?'),
(1, 'Jika kita bisa menyumbangkan satu hal untuk dunia, apa itu?'),
(1, 'Apa rahasia sukses persahabatan kita menurutmu?'),
(1, 'Siapa yang paling bisa diandalkan saat keadaan darurat?'),
(1, 'Apa acara tahunan yang harus kita mulai lakukan?'),
(1, 'Jika kita membuat podcast, topik apa yang akan kita bahas?'),
(1, 'Apa pelajaran hidup terbesar yang kamu dapat dari persahabatan ini?');

-- 🔹 Untuk kategori Pasangan
INSERT INTO questions (category_id, title) VALUES
(2, 'Apa hal yang paling membuatmu merasa aman bersamaku?'),
(2, 'Jika cinta kita dijadikan novel, genre apa yang cocok?'),
(2, 'Apa kebiasaan kecilku yang selalu kamu tunggu setiap hari?'),
(2, 'Bagaimana kita bisa menjaga api cinta tetap menyala?'),
(2, 'Apa yang ingin kamu pelajari tentang diriku yang belum kamu ketahui?'),
(2, 'Jika kita bisa menciptakan ritual khusus berdua, apa itu?'),
(2, 'Apa momen di mana kamu menyadari "ini dia orangnya"?'),
(2, 'Apa pujian dariku yang paling kamu ingat?'),
(2, 'Jika kita punya mesin waktu, ke masa depan atau masa lalu kita akan pergi?'),
(2, 'Apa perbedaan kita yang justru membuatmu jatuh cinta?'),
(2, 'Bagaimana cara idealmu menghabiskan malam minggu bersamaku?'),
(2, 'Apa hal yang paling ingin kamu ubah dari caraku memelukmu?'),
(2, 'Jika aku adalah warna, warna apa yang menggambarkan diriku?'),
(2, 'Apa ketakutan terbesarmu tentang komitmen dalam hubungan ini?'),
(2, 'Apa yang membuatmu tetap bertahan saat kita sedang tidak sejalan?'),
(2, 'Jika kita bisa berbagi satu mimpi, apa yang ingin kamu alami bersamaku?'),
(2, 'Apa kebohongan kecil yang pernah kamu lakukan untuk membuatku senang?'),
(2, 'Bagaimana kamu membayangkan kita di usia tua nanti?'),
(2, 'Apa hal pertama yang akan kamu lakukan jika aku tiba-tiba menghilang?'),
(2, 'Apa yang paling ingin kamu dengar saat kita bertengkar?'),
(2, 'Jika cinta kita adalah lagu, lirik apa yang paling merepresentasikannya?'),
(2, 'Apa momen di mana kamu merasa paling dekat denganku?'),
(2, 'Apa hal yang paling ingin kamu ajarkan kepadaku?'),
(2, 'Jika kita bisa memilih satu destinasi bulan madu, di mana itu?'),
(2, 'Apa yang membuatmu yakin bahwa kita bisa melewati segala rintangan?');


