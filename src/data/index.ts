export const categories = [
    // { id: 1, name: "siblings" },
    // { id: 2, name: "families" },
    { id: 3, name: "friends" },
    { id: 4, name: "couples" }
];

let questionId = 1;

const rawQuestions = [
    // { category_id: 1, text: "Apa kenangan masa kecil yang paling lucu bersama saudaramu?" },
    // { category_id: 1, text: "Siapa yang paling sering membuat masalah saat kecil?" },
    // { category_id: 1, text: "Apa kebiasaan unik yang dimiliki saudaramu?" },

    // { category_id: 2, text: "Apa pelajaran hidup terpenting yang ingin Ayah/Ibu wariskan?" },
    // { category_id: 2, text: "Kalau bisa mengubah satu peraturan di rumah, apa yang akan kamu ubah?" },
    // { category_id: 2, text: "Apa momen bersama keluarga yang paling berkesan tahun ini?" },
    // { category_id: 2, text: "Bagaimana cara terbaik menurutmu untuk menghabiskan waktu liburan?" },
    // { category_id: 2, text: "Apa yang membuatmu merasa paling bangga menjadi bagian dari keluarga ini?" },
    
    { "category_id": 3, "text": "Apa mimpi terliar kita yang belum tercapai?" },
    { "category_id": 3, "text": "Siapa yang paling jago menghadapi masalah dalam grup?" },
    { "category_id": 3, "text": "Jika kita jadi karakter serial TV, peran apa yang cocok untuk masing-masing?" },
    { "category_id": 3, "text": "Apa kebohongan putih yang pernah kamu lakukan untuk teman?" },
    { "category_id": 3, "text": "Kalau grup kita punya motto, kira-kira apa?" },
    { "category_id": 3, "text": "Siapa yang paling mungkin jadi influencer TikTok?" },
    { "category_id": 3, "text": "Apa permainan papan yang selalu memicu persaingan sengit?" },
    { "category_id": 3, "text": "Jika ada satu anggota yang bisa jadi alien, siapa kandidatnya?" },
    { "category_id": 3, "text": "Apa tradisi konyol yang hanya dimengerti oleh kita?" },
    { "category_id": 3, "text": "Siapa yang akan jadi detektif terbaik di antara kita?" },
    { "category_id": 3, "text": "Apa momen paling memalukan yang kita alami bersama?" },
    { "category_id": 3, "text": "Jika kita bisa kolaborasi dengan artis, lagu apa yang akan kita cover?" },
    { "category_id": 3, "text": "Apa hadiah terburuk yang pernah kita tukarkan?" },
    { "category_id": 3, "text": "Siapa yang paling sering jadi 'korban' lelucon kita?" },
    { "category_id": 3, "text": "Apa hobi baru yang ingin kita coba bersama?" },
    { "category_id": 3, "text": "Jika grup kita punya menu signature di kafe, apa namanya?" },
    { "category_id": 3, "text": "Apa kesamaan teraneh antara kita semua?" },
    { "category_id": 3, "text": "Siapa yang akan jadi survivor jika zombie apocalypse terjadi?" },
    { "category_id": 3, "text": "Apa momen di mana kamu merasa sangat bersyukur punya teman seperti kami?" },
    { "category_id": 3, "text": "Jika kita bisa menyumbangkan satu hal untuk dunia, apa itu?" },
    { "category_id": 3, "text": "Apa rahasia sukses persahabatan kita menurutmu?" },
    { "category_id": 3, "text": "Siapa yang paling bisa diandalkan saat keadaan darurat?" },
    { "category_id": 3, "text": "Apa acara tahunan yang harus kita mulai lakukan?" },
    { "category_id": 3, "text": "Jika kita membuat podcast, topik apa yang akan kita bahas?" },
    { "category_id": 3, "text": "Apa pelajaran hidup terbesar yang kamu dapat dari persahabatan ini?" },
    
    { "category_id": 4, "text": "Apa hal yang paling membuatmu merasa aman bersamaku?" },
    { "category_id": 4, "text": "Jika cinta kita dijadikan novel, genre apa yang cocok?" },
    { "category_id": 4, "text": "Apa kebiasaan kecilku yang selalu kamu tunggu setiap hari?" },
    { "category_id": 4, "text": "Bagaimana kita bisa menjaga api cinta tetap menyala?" },
    { "category_id": 4, "text": "Apa yang ingin kamu pelajari tentang diriku yang belum kamu ketahui?" },
    { "category_id": 4, "text": "Jika kita bisa menciptakan ritual khusus berdua, apa itu?" },
    { "category_id": 4, "text": "Apa momen di mana kamu menyadari 'ini dia orangnya'?" },
    { "category_id": 4, "text": "Apa pujian dariku yang paling kamu ingat?" },
    { "category_id": 4, "text": "Jika kita punya mesin waktu, ke masa depan atau masa lalu kita akan pergi?" },
    { "category_id": 4, "text": "Apa perbedaan kita yang justru membuatmu jatuh cinta?" },
    { "category_id": 4, "text": "Bagaimana cara idealmu menghabiskan malam minggu bersamaku?" },
    { "category_id": 4, "text": "Apa hal yang paling ingin kamu ubah dari caraku memelukmu?" },
    { "category_id": 4, "text": "Jika aku adalah warna, warna apa yang menggambarkan diriku?" },
    { "category_id": 4, "text": "Apa ketakutan terbesarmu tentang komitmen dalam hubungan ini?" },
    { "category_id": 4, "text": "Apa yang membuatmu tetap bertahan saat kita sedang tidak sejalan?" },
    { "category_id": 4, "text": "Jika kita bisa berbagi satu mimpi, apa yang ingin kamu alami bersamaku?" },
    { "category_id": 4, "text": "Apa kebohongan kecil yang pernah kamu lakukan untuk membuatku senang?" },
    { "category_id": 4, "text": "Bagaimana kamu membayangkan kita di usia tua nanti?" },
    { "category_id": 4, "text": "Apa hal pertama yang akan kamu lakukan jika aku tiba-tiba menghilang?" },
    { "category_id": 4, "text": "Apa yang paling ingin kamu dengar saat kita bertengkar?" },
    { "category_id": 4, "text": "Jika cinta kita adalah lagu, lirik apa yang paling merepresentasikannya?" },
    { "category_id": 4, "text": "Apa momen di mana kamu merasa paling dekat denganku?" },
    { "category_id": 4, "text": "Apa hal yang paling ingin kamu ajarkan kepadaku?" },
    { "category_id": 4, "text": "Jika kita bisa memilih satu destinasi bulan madu, di mana itu?" },
    { "category_id": 4, "text": "Apa yang membuatmu yakin bahwa kita bisa melewati segala rintangan?" }
];

export const questions = rawQuestions.map(q => ({ id: questionId++, ...q }));
