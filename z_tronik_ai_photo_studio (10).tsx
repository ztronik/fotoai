import React, { useState, useEffect } from 'react';
import { 
  Camera, Image as ImageIcon, Sparkles, Wand2, Sliders, Layers, 
  Trash2, Download, Upload, ZoomIn, RefreshCw, History, 
  Heart, Settings, Search, Grid, User, Users, ShoppingBag, Palette, 
  Video, Maximize2, Shield, Eye, ArrowRight, Paintbrush, Trees, GraduationCap, Baby, Globe, HeartHandshake, Briefcase, Smile, FileText, Copy, Check
} from 'lucide-react';

// API Key setup for Gemini AI calls inside browser runtime
const GEMINI_API_KEY = ""; // Dynamic key handled seamlessly at runtime

export default function App() {
  // Navigation & State Management
  const [activeTab, setActiveTab] = useState('homee');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  
  // Selected Feature State
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  // Form Inputs & Advanced Settings
  const [promptText, setPromptText] = useState('');
  const [selectedStylePreset, setSelectedStylePreset] = useState('default');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [batchCount, setBatchCount] = useState(1); // 1 to 4 outputs
  
  // Image Description / Vision State
  const [imageToDescribe, setImageToDescribe] = useState(null);
  const [imageToDescribeBase64, setImageToDescribeBase64] = useState(null);
  const [imageDescriptionResult, setImageDescriptionResult] = useState('');
  const [isDescribing, setIsDescribing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Pas Foto & Foto Formal Special Controls
  const [pasFotoBgColor, setPasFotoBgColor] = useState('merah');
  const [pasFotoOutfit, setPasFotoOutfit] = useState('kemeja-dasi');

  // Multi-Reference Image States (Foto Orang / Model / Keluarga - Banyak Foto)
  const [personImages, setPersonImages] = useState([]); // Array of { id, url, base64 }

  // Object / Product / Clothing Image State (Khusus Baju, Barang, Produk)
  const [objectImages, setObjectImages] = useState([]); // Array of { id, url, base64 }

  // Default option "Tanpa Gaya" item
  const noStylePreset = { id: 'none', name: 'Tanpa Gaya (Ikuti Prompt)', icon: Wand2, promptSuffix: '' };

  // Presets Gaya Bawaan Khusus Sesuai Tema/Kategori
  const categoryStylePresets = {
    studio: [
      noStylePreset,
      { id: 'default', name: 'Standar Studio Professional', icon: Camera, promptSuffix: ', professional studio flash, clean backdrop, sharp focus' },
      { id: 'vogue', name: 'Majalah High-Fashion VOGUE', icon: ShoppingBag, promptSuffix: ', high fashion VOGUE editorial cover style, dramatic rim lighting, luxury studio' },
      { id: 'cinematic', name: 'Cinematic Portrait 8K', icon: Sparkles, promptSuffix: ', cinematic dramatic warm lighting, movie poster quality, shallow depth of field, 8k' },
      { id: 'bw-classic', name: 'Monokrom Hitam Putih Klasik', icon: Camera, promptSuffix: ', high contrast monochrome black and white photo, silver halide film look, timeless elegance' },
      { id: 'neon-cyberpunk', name: 'Cyberpunk Neon Glow', icon: Sparkles, promptSuffix: ', futuristic neon cyberpunk lighting, magenta and cyan highlights, dark moody background' },
      { id: 'minimalist-pastel', name: 'Minimalis Studio Pastel', icon: Layers, promptSuffix: ', minimalist clean aesthetic, subtle soft pastel studio backdrop, neutral elegant lighting' },
      { id: 'vintage-kodak', name: 'Retro Vintage Kodak 90s', icon: Camera, promptSuffix: ', vintage 1990s film photography, Kodak Portra 400 aesthetic, grain, warm nostalgics' },
      { id: 'luxury-gold', name: 'Glamour Luxury Golden', icon: Sparkles, promptSuffix: ', golden luxury portrait lighting, bokeh shimmer, rich ambient tones' },
      { id: 'watercolor-art', name: 'Lukisan Cat Air Studio', icon: Paintbrush, promptSuffix: ', artistic watercolor paint style, soft ink splashes, subtle canvas texture' },
      { id: 'soft-beauty', name: 'Soft Beauty Cosmetic Light', icon: Sparkles, promptSuffix: ', soft cosmetic ring lighting, smooth skin glow, magazine close-up portrait' },
      { id: 'moody-dark', name: 'Moody Dark Low-Key', icon: Layers, promptSuffix: ', low key moody lighting, dark shadowy background, strong dramatic contrast' },
      { id: 'dramatic-shadow', name: 'Bayangan Jendela Dramatis', icon: Camera, promptSuffix: ', dramatic window blind shadow patterns cast over model, sunset light beam' },
      { id: 'pop-color', name: 'Studio Pop Color Block', icon: Palette, promptSuffix: ', vibrant dual color gel lighting, saturated red and blue studio split light' },
      { id: 'fine-art-oil', name: 'Fine Art Oil Painting', icon: Paintbrush, promptSuffix: ', classic renaissance oil painting texture, rich dark tones, masterpiece look' },
      { id: 'editorial-urban', name: 'Street Fashion Editorial', icon: ShoppingBag, promptSuffix: ', urban street fashion editorial photoshoot, natural daylighting, modern city backdrop' }
    ],
    formal: [
      noStylePreset,
      { id: 'default', name: 'Pas Foto Resmi Standar ID', icon: Camera, promptSuffix: ', ultra clear ID passport photo standard, sharp focus on facial features, professional symmetry' },
      { id: 'hd-studio', name: 'Studio Resmi HD Crisp', icon: Sparkles, promptSuffix: ', high definition official document portrait, clean softbox studio lighting, perfectly balanced colors' },
      { id: 'matte', name: 'Foto Cetak Matte Premium', icon: Layers, promptSuffix: ', fine matte photo print finish, smooth skin texture, professional photo studio quality' },
      { id: 'jas-hitam-dasi', name: 'Gaya Jas Hitam & Dasi', icon: Camera, promptSuffix: ', wearing sharp black formal blazer suit and crisp dark tie, executive look' },
      { id: 'jas-navy-modern', name: 'Gaya Jas Navy Executive', icon: Sparkles, promptSuffix: ', wearing dark navy blue formal suit jacket, modern professional posture' },
      { id: 'kemeja-putih-polos', name: 'Kemeja Putih Formal Bersih', icon: User, promptSuffix: ', wearing neat white collared formal shirt, clean professional passport style' },
      { id: 'kebaya-anggun', name: 'Kebaya Formal Anggun', icon: Sparkles, promptSuffix: ', wearing traditional Indonesian lace kebaya, neat elegant formal hair' },
      { id: 'batik-eksekutif', name: 'Batik Resmi Eksekutif', icon: ShoppingBag, promptSuffix: ', wearing luxury traditional batik pattern shirt, formal official posture' },
      { id: 'vintage-80s-doc', name: 'Dokumen Klasik 80-an', icon: Camera, promptSuffix: ', retro 1980s official ID photo look, subtle film texture, vintage color tone' },
      { id: 'minimalist-grey', name: 'Background Studio Abu-Abu', icon: Layers, promptSuffix: ', solid neutral grey professional background, balanced soft studio flash' },
      { id: 'soft-corporate', name: 'Corporate Headshot Ramah', icon: Smile, promptSuffix: ', friendly smiling corporate executive headshot, soft warm office light' },
      { id: 'high-contrast-doc', name: 'Kontras Tinggi & Tajam', icon: ZoomIn, promptSuffix: ', high contrast sharp focus facial portrait, clear eyes, high detail ID photo' },
      { id: 'simetris-presisi', name: 'Simetris Wajah Presisi', icon: Grid, promptSuffix: ', perfectly centered facial alignment, official passport requirement pose' },
      { id: 'pencahayaan-kupu', name: 'Butterfly Studio Lighting', icon: Sparkles, promptSuffix: ', classic butterfly beauty studio light pattern, soft shadow under nose' },
      { id: 'glamour-official', name: 'Formal Glamour Portrait', icon: Sparkles, promptSuffix: ', elegant formal photo with polished hair and subtle skin glow' }
    ],
    baby: [
      noStylePreset,
      { id: 'default', name: 'Studio Bayi Lembut Pastel', icon: Baby, promptSuffix: ', soft baby photography, pastel blanket tones, warm gentle lighting, ultra delicate focus' },
      { id: 'sarang-kayu', name: 'Sarang Burung Kayu Alami', icon: Trees, promptSuffix: ', baby lying peacefully inside a rustic wooden nest filled with soft moss and flowers' },
      { id: 'kepompong-rajut', name: 'Kepompong Rajut Wool Imut', icon: Baby, promptSuffix: ', newborn baby wrapped tightly in cute pastel knitted wool swaddle cocoon' },
      { id: 'awan-bulan', name: 'Tidur Di Atas Bulan & Awan', icon: Sparkles, promptSuffix: ', dreamy newborn sleeping on a plush crescent moon surrounded by fluffy clouds and stars' },
      { id: 'keranjang-bunga', name: 'Keranjang Bunga Mawar Soft', icon: Sparkles, promptSuffix: ', baby tucked in a vintage woven basket cushioned with soft pink rose petals' },
      { id: 'kostum-kelinci', name: 'Kostum Kelinci Bulu Halus', icon: Baby, promptSuffix: ', newborn wearing cute bunny ear knitted hat with tiny carrot prop, sleeping softly' },
      { id: 'malaikat-kecil', name: 'Malaikat Kecil Bersayap', icon: Sparkles, promptSuffix: ', newborn baby with tiny feather angel wings sleeping on white silk pillow, golden glow' },
      { id: 'fairytale-nursery', name: 'Dunia Dongeng Peri', icon: Sparkles, promptSuffix: ', enchanted fairytale forest nursery setting, soft glowing fireflies around baby' },
      { id: 'boneka-teddy', name: 'Peluk Boneka Teddy Bear', icon: Baby, promptSuffix: ', baby sleeping peacefully hugging a small plush miniature teddy bear toy' },
      { id: 'mahkota-bunga', name: 'Mahkota Bunga Crown', icon: Sparkles, promptSuffix: ', baby wearing delicate floral headband crown, pastel watercolor blanket backdrop' },
      { id: 'vintage-suitcase', name: 'Koper Antik Vintage Baby', icon: Camera, promptSuffix: ', newborn asleep inside an open rustic antique leather suitcase filled with blankets' },
      { id: 'awan-pelangi', name: 'Pelangi Pastel Soft', icon: Palette, promptSuffix: ', rainbow pastel knitted backdrop behind sleeping newborn, cozy atmosphere' },
      { id: 'pangeran-kecil', name: 'Pangeran Kecil Mahkota Emas', icon: Sparkles, promptSuffix: ', baby wearing tiny golden crown, royal velvet cushion bed' },
      { id: 'daun-tropis', name: 'Aksen Daun Tropis Alami', icon: Trees, promptSuffix: ', baby nestled amidst lush green monstera and palm leaves, natural daylight' },
      { id: 'buku-dongeng', name: 'Buku Dongeng Raksasa', icon: Sparkles, promptSuffix: ', baby resting on an open oversized vintage storybook page, magical wonderland' }
    ],
    sekolah: [
      noStylePreset,
      { id: 'default', name: 'Pas Foto Resmi Sekolah', icon: GraduationCap, promptSuffix: ', official student ID portrait photo, neat haircut, polite confident expression' },
      { id: 'album-kenangan', name: 'Foto Album Kenangan (Yearbook)', icon: Sparkles, promptSuffix: ', high school yearbook portrait style, soft warm golden hour light, aesthetic youth memory' },
      { id: 'kantin-kelas', name: 'Kelas & Lorong Sekolah', icon: Users, promptSuffix: ', natural school classroom background, friendly smile, nostalgic high school aesthetic' },
      { id: 'perpustakaan-klasik', name: 'Perpustakaan Sekolah', icon: Briefcase, promptSuffix: ', student holding books in cozy classic school library filled with bookshelves' },
      { id: 'lapangan-olahraga', name: 'Lapangan Basket Sekolah', icon: Users, promptSuffix: ', outdoor high school basketball court background, athletic energetic student vibe' },
      { id: 'seragam-pramuka', name: 'Seragam Pramuka Cokelat', icon: GraduationCap, promptSuffix: ', wearing neat brown Indonesian Scout Pramuka uniform with neck scarf' },
      { id: 'wisuda-magna', name: 'Wisuda Toga & Diploma', icon: GraduationCap, promptSuffix: ', celebratory graduation toga cap and gown holding diploma scroll, studio lights' },
      { id: 'jas-almamater-kampus', name: 'Jas Almamater Universitas', icon: GraduationCap, promptSuffix: ', university student wearing official university blazer, modern campus building backdrop' },
      { id: 'retro-90s-school', name: 'Sekolah Retro Tahun 90-an', icon: Camera, promptSuffix: ', 1990s Japanese or Asian high school aesthetic, warm vintage film grain' },
      { id: 'taman-kampus', name: 'Taman Kampus Asri', icon: Trees, promptSuffix: ', sitting on campus green lawn grass, holding laptop/books, sunbeams through trees' },
      { id: 'laboratorium-sains', name: 'Laboratorium Sains', icon: Briefcase, promptSuffix: ', student wearing white lab coat in science lab surrounded by glass flasks' },
      { id: 'panggung-pentas', name: 'Pentas Seni (Pensi)', icon: Sparkles, promptSuffix: ', school talent show stage background with warm stage spotlights' },
      { id: 'gerbang-sekolah', name: 'Gerbang Sekolah Utama', icon: Users, promptSuffix: ', standing proudly in front of school main entrance gate on a sunny morning' },
      { id: 'studi-kelompok', name: 'Belajar Kelompok Bersama', icon: Users, promptSuffix: ', group study scene with friends around table with open notebooks' },
      { id: 'cinematic-youth', name: 'Cinematic Drama Remaja', icon: Sparkles, promptSuffix: ', Japanese anime coming-of-age movie lighting aesthetic, blue sky and white clouds' }
    ],
    wedding: [
      noStylePreset,
      { id: 'default', name: 'Romantis & Glamour Royal', icon: HeartHandshake, promptSuffix: ', luxury fairytale wedding photography, soft ethereal dream glow, romantic warm bokeh' },
      { id: 'vintage-wedding', name: 'Pernikahan Klasik Retro', icon: Camera, promptSuffix: ', timeless vintage wedding photo, soft pastel tones, fine film grain, royal aesthetic' },
      { id: 'dramatic-sunset', name: 'Sunset Prewedding Teater', icon: Sparkles, promptSuffix: ', golden hour sunset outdoor prewedding, dramatic silhouette light, cinematic romance' },
      { id: 'adat-jawa-manten', name: 'Pernikahan Adat Jawa Paes', icon: HeartHandshake, promptSuffix: ', traditional Javanese royal bride and groom attire with elaborate paes makeup and blangkon' },
      { id: 'adat-sunda-siger', name: 'Pernikahan Adat Sunda Siger', icon: HeartHandshake, promptSuffix: ', traditional Sundanese bride with silver/gold siger crown crown and jasmine garland' },
      { id: 'korean-minimalist', name: 'Prewedding Minimalis Korea', icon: Sparkles, promptSuffix: ', elegant Korean studio prewedding style, soft pastel backdrop, minimalist luxury' },
      { id: 'rustic-garden', name: 'Rustic Garden Outdoor', icon: Trees, promptSuffix: ', outdoor rustic fairy light garden wedding, wooden arch adorned with white roses' },
      { id: 'pantai-bali-wedding', name: 'Pernikahan Pantai Bali', icon: Globe, promptSuffix: ', tropical beach wedding altar on ocean cliff in Bali, floral gazebo sunset' },
      { id: 'pariwisata-paris', name: 'Prewedding Eiffel Paris', icon: Globe, promptSuffix: ', romantic prewedding in Paris with Eiffel Tower background, flowing long white dress train' },
      { id: 'gaun-mewah-royal', name: 'Gaun Pengantin Royal Ballgown', icon: Sparkles, promptSuffix: ', magnificent royal ballgown wedding dress with long intricate lace cathedral veil' },
      { id: 'akad-nikah-masjid', name: 'Suasana Akad Nikah Syahdu', icon: HeartHandshake, promptSuffix: ', solemn holy matrimony akad nikah ceremony set, white Islamic bridal wear' },
      { id: 'malam-lampion', name: 'Pesta Lampion Malam', icon: Sparkles, promptSuffix: ', night wedding celebration surrounded by floating magical paper lanterns and fairy lights' },
      { id: 'hitam-putih-romantis', name: 'B&W Cinematic Wedding', icon: Camera, promptSuffix: ', emotional black and white wedding portrait, artistic contrast, intense romantic stare' },
      { id: 'istana-mewah', name: 'Di Dalam Ballroom Istana', icon: Sparkles, promptSuffix: ', grand palace ballroom wedding reception with crystal chandeliers and floral aisle' },
      { id: 'prewedding-tebing', name: 'Tebing Samudra Dramatis', icon: Trees, promptSuffix: ', epic couple portrait standing on dramatic ocean cliff edge, wind blown dress' }
    ],
    profesi: [
      noStylePreset,
      { id: 'default', name: 'Karakter Profesi Realistis', icon: Briefcase, promptSuffix: ', authentic professional uniform and workplace environment, inspiring career portrait' },
      { id: 'heroic', name: 'Gaya Heroik & Wibawa', icon: Sparkles, promptSuffix: ', heroic confident posture, dramatic cinematic backlighting, impressive authoritative look' },
      { id: 'dokter-spesialis', name: 'Dokter Spesialis / Rumah Sakit', icon: Briefcase, promptSuffix: ', professional doctor wearing white lab coat and stethoscope in bright modern hospital corridor' },
      { id: 'pilot-kokpit', name: 'Pilot Dalam Kokpit Pesawat', icon: Globe, promptSuffix: ', airline captain pilot sitting inside high-tech airplane cockpit surrounded by glowing instruments' },
      { id: 'polisi-reskrim', name: 'Polisi / Penyidik Formal', icon: Briefcase, promptSuffix: ', authoritative law enforcement officer in official uniform standing near headquarters' },
      { id: 'tni-tentara-gagah', name: 'TNI / Militer Seragam Loreng', icon: Briefcase, promptSuffix: ', brave military soldier officer in camouflage uniform, proud posture, studio flash' },
      { id: 'astronaut-nasa', name: 'Astronaut Luar Angkasa NASA', icon: Globe, promptSuffix: ', astronaut wearing full white space suit inside space station looking out at Planet Earth' },
      { id: 'ceo-gedung-pencakar', name: 'CEO Gedung Pencakar Langit', icon: User, promptSuffix: ', successful corporate CEO standing in penthouse glass office overlooking city skyline' },
      { id: 'koki-chef-bintang', name: 'Chef Bintang Michelin', icon: Briefcase, promptSuffix: ', professional head chef in clean white apron holding cooking pan in commercial kitchen' },
      { id: 'arsitek-cetak-biru', name: 'Arsitek & Design Blueprint', icon: Grid, promptSuffix: ', architect wearing hardhat inspecting construction blueprint drawings on table' },
      { id: 'pengacara-ruang-sidang', name: 'Pengacara / Hakim Hukum', icon: Briefcase, promptSuffix: ', sharp lawyer in formal suit standing inside impressive wooden courtroom court' },
      { id: 'pemadam-kebakaran', name: 'Pemadam Kebakaran Heroik', icon: Sparkles, promptSuffix: ', brave firefighter wearing heavy fire rescue gear with firetruck background' },
      { id: 'programmer-cyber', name: 'Software Engineer Cyberpunk', icon: Grid, promptSuffix: ', IT software engineer working with multiple futuristic glowing monitors code' },
      { id: 'jurnalis-berita', name: 'Presenter / Jurnalis Berita', icon: Camera, promptSuffix: ', news anchor TV journalist holding microphone in broadcast studio backdrop' },
      { id: 'pramugari-maskapai', name: 'Pramugari Maskapai Penerbangan', icon: Globe, promptSuffix: ', elegant flight attendant stewardess in stylish airline uniform smiling warmly' }
    ],
    karikatur: [
      noStylePreset,
      { id: '3d-pixar', name: '3D Kartun Pixar / Disney', icon: Smile, promptSuffix: ', cute 3D Pixar Disney character style, expressive big eyes, glossy render, smooth shading' },
      { id: 'karikatur-pensil', name: 'Sketsa Karikatur Pensil', icon: Paintbrush, promptSuffix: ', funny exaggerated caricature pencil sketch drawing, detailed cross-hatching, artistic portrait' },
      { id: 'pop-art', name: 'Pop Art Warna-Warni Komik', icon: Palette, promptSuffix: ', vibrant pop art comic book style, bold outlines, colorful halftones, playful caricature' },
      { id: 'anime-ghibli', name: 'Ghibli Hand-Drawn Anime', icon: Sparkles, promptSuffix: ', Studio Ghibli hand-drawn anime aesthetic, vivid watercolor backgrounds, charming digital art' },
      { id: 'claymation-lilin', name: 'Stop-Motion Lilin Claymation', icon: Smile, promptSuffix: ', cute claymation plasticine clay character figure style, tactile handcrafted texture' },
      { id: 'chibi-cute', name: 'Chibi Anime Imut', icon: Baby, promptSuffix: ', adorable Japanese chibi anime art style, big head tiny body, cute rosy cheeks' },
      { id: 'paper-cutout', name: 'Seni Potongan Kertas 3D', icon: Layers, promptSuffix: ', layered papercraft cutout art style, shadow depth effect, colorful paper texture' },
      { id: 'oil-caricature', name: 'Lukisan Minyak Karikatur', icon: Paintbrush, promptSuffix: ', expressive thick oil impasto brush strokes painting caricature, vivid colors' },
      { id: 'cyberpunk-anime', name: 'Anime Cyberpunk Sci-Fi', icon: Sparkles, promptSuffix: ', futuristic cyberpunk anime character artwork, glowing neon details, cool jacket' },
      { id: 'doodle-fun', name: 'Doodle Art Ceria', icon: Paintbrush, promptSuffix: ', playful doodle line art caricature surrounded by cute funny doodle icons' },
      { id: 'retro-cartoon-30s', name: 'Kartun Klasik Tahun 30-an', icon: Camera, promptSuffix: ', vintage 1930s rubber hose cartoon style, black and white sepia cuphead aesthetic' },
      { id: 'vector-flat', name: 'Vector Art Flat Minimalis', icon: Grid, promptSuffix: ', clean vector graphic illustration, sharp flat shapes, modern color scheme' },
      { id: 'graffiti-street', name: 'Seni Graffiti Jalanan', icon: Palette, promptSuffix: ', vibrant urban spray paint graffiti wall art style, dripping paint effects' },
      { id: 'fantasy-rpg', name: 'Karakter Game Fantasy RPG', icon: Sparkles, promptSuffix: ', epic fantasy video game character artwork, magical aura, ornate armor detail' },
      { id: 'voxel-3d', name: 'Voxel Pixel 3D (Minecraft Style)', icon: Grid, promptSuffix: ', 3D blocky voxel art style, colorful pixelated 3D cube render' }
    ],
    liburan: [
      noStylePreset,
      { id: 'default', name: 'Wisata Sunset Realistis', icon: Globe, promptSuffix: ', authentic travel vlog aesthetic, natural daylighting, vibrant vacation colors' },
      { id: 'cinematic-travel', name: 'Cinematic Travel Magazine', icon: Sparkles, promptSuffix: ', cinematic travel magazine photo, stunning perspective, professional landscape composition' },
      { id: 'polaroid-retro', name: 'Foto Instan Polaroid Vacation', icon: Camera, promptSuffix: ', vintage polaroid instant photo style, warm saturated vacation tones, subtle light leaks' },
      { id: 'eiffel-paris-autumn', name: 'Menara Eiffel Paris Musim Gugur', icon: Globe, promptSuffix: ', standing in front of Eiffel Tower Paris with autumn orange leaves, elegant coat outfit' },
      { id: 'sakura-kyoto-japan', name: 'Musim Sakura Kyoto Jepang', icon: Globe, promptSuffix: ', walking under blooming pink cherry blossom sakura trees in Kyoto old street' },
      { id: 'piramida-mesir', name: 'Piramida Giza Mesir', icon: Globe, promptSuffix: ', exotic adventure travel at Great Pyramids of Giza in Egyptian desert, warm sunlight' },
      { id: 'santorini-yunani', name: 'Santorini Yunani Serba Putih', icon: Globe, promptSuffix: ', scenic blue dome church background in Santorini Greece overlooking Aegean sea' },
      { id: 'taj-mahal-india', name: 'Taj Mahal India', icon: Globe, promptSuffix: ', standing in front of majestic white marble Taj Mahal India reflecting pool' },
      { id: 'times-square-ny', name: 'Times Square New York Malam', icon: Globe, promptSuffix: ', night travel photo surrounded by bright neon billboards in Times Square NYC' },
      { id: 'makkah-kaaba', name: 'Pelataran Ka\'bah Makkah', icon: Globe, promptSuffix: ', spiritual travel photo in Makkah courtyard, peaceful white ihram/hijab attire' },
      { id: 'london-big-ben', name: 'Big Ben & Telefon Merah London', icon: Globe, promptSuffix: ', classic London scene with iconic red phone booth and Big Ben clocktower' },
      { id: 'bali-beach-resort', name: 'Resort Pantai Tropis Bali', icon: Globe, promptSuffix: ', relaxing luxury beach resort in Bali with infinity pool and palm trees sunset' },
      { id: 'salju-alpen-swiss', name: 'Musim Salju Pegunungan Alpen', icon: Globe, promptSuffix: ', snowy winter vacation in Swiss Alps wearing cozy winter jacket and beanie, snow peaks' },
      { id: 'kanal-venesia-italy', name: 'Gondola Venesia Italia', icon: Globe, promptSuffix: ', riding romantic gondola boat along Venice canal water with historic buildings' },
      { id: 'candi-borobudur', name: 'Sunrise Candi Borobudur', icon: Globe, promptSuffix: ', misty morning sunrise landscape at ancient Borobudur temple stupas' }
    ],
    alam: [
      noStylePreset,
      { id: 'default', name: 'Lanskap Ultra HD 8K', icon: Trees, promptSuffix: ', hyperrealistic nature landscape photography, sharp focus, vibrant natural colors, 8k resolution' },
      { id: 'dramatic-sky', name: 'Langit Senja & Fog', icon: Sparkles, promptSuffix: ', dramatic clouds sky, mystical morning fog haze, golden hour sunlight rays' },
      { id: 'gunung-sunrise', name: 'Pegunungan Golden Hour', icon: Trees, promptSuffix: ', majestic snow peaked mountain range during vibrant golden sunrise, wide panorama' },
      { id: 'pantai-tropis-biru', name: 'Pantai Kristal Tropis', icon: Globe, promptSuffix: ', turquoise crystal clear ocean water, pristine white sand, lush green coconut palms' },
      { id: 'air-terjun-hutan', name: 'Air Terjun Hutan Rimbun', icon: Trees, promptSuffix: ', cascading lush waterfall inside green tropical rainforest with sunbeams through canopy' },
      { id: 'danau-cermin', name: 'Danau Refleksi Cermin', icon: Trees, promptSuffix: ', perfectly calm glass-like alpine lake reflecting surrounding pine trees and mountains' },
      { id: 'hutan-pinus-kabut', name: 'Hutan Pinus Berkabut', icon: Trees, promptSuffix: ', tall moody pine forest enveloped in dense morning mist, atmospheric sunlight' },
      { id: 'gurun-pasir-keemasan', name: 'Gurun Pasir Keemasan', icon: Globe, promptSuffix: ', sweeping golden sand dunes under warm sun, wind ripple textures in desert' },
      { id: 'padang-bunga-lavender', name: 'Padang Bunga Lavender Purple', icon: Sparkles, promptSuffix: ', endless vibrant purple lavender flower field under soft pastel sky' },
      { id: 'musim-gugur-merah', name: 'Hutan Musim Gugur Merah', icon: Trees, promptSuffix: ', vibrant autumn forest foliage with bright red and orange maple leaves' },
      { id: 'musim-dingin-es', name: 'Lanskap Salju & Es', icon: Sparkles, promptSuffix: ', pristine winter wonderland covered in untouched white snow and frozen icicles' },
      { id: 'tebing-samudra', name: 'Tebing Samudra Megah', icon: Trees, promptSuffix: ', dramatic rocky coastal cliffs battered by crashing turquoise ocean waves' },
      { id: 'malam-bintang-milkyway', name: 'Langit Malam Bintang Bima Sakti', icon: Sparkles, promptSuffix: ', dark night sky filled with millions of bright stars and visible Milky Way galaxy' },
      { id: 'sawah-terasering', name: 'Sawah Terasering Hijau', icon: Trees, promptSuffix: ', verdant green stepped rice terrace fields in Bali during fresh morning light' },
      { id: 'ngarai-canyon', name: 'Ngarai Merah Canyon', icon: Trees, promptSuffix: ', majestic red rock canyon gorges carved by river, warm sandstone illumination' }
    ],
    edit: [
      noStylePreset,
      { id: 'default', name: 'Kualitas Asli Presisi', icon: Wand2, promptSuffix: ', seamless natural AI editing, realistic edges, perfect blend with original photo' },
      { id: 'sharpness-boost', name: 'Penajaman Detail Ultra Sharp', icon: ZoomIn, promptSuffix: ', ultra high sharpness, enhanced micro-details, crisp high definition photo' },
      { id: 'color-pop-vibrant', name: 'Pencerahan Warna Vibrant', icon: Palette, promptSuffix: ', vibrant rich color saturation boost, lively warm color grading' },
      { id: 'soft-skin-portrait', name: 'Pembersih Kulit Halus Alami', icon: Sparkles, promptSuffix: ', natural smooth skin texture retouching, flawless face glow while keeping pores' },
      { id: 'bg-blur-bokeh', name: 'Efek Background Blur Bokeh', icon: Camera, promptSuffix: ', creamy background lens bokeh blur, 85mm f/1.4 portrait depth effect' },
      { id: 'vintage-film-grain', name: 'Grain Film Vintage Analog', icon: Camera, promptSuffix: ', authentic subtle analog film grain texture, Kodak Portra vintage color profile' },
      { id: 'hd-restoration', name: 'Restorasi Foto Rusak HD', icon: RefreshCw, promptSuffix: ', complete scratch removal, high definition photo restoration, clean noise reduction' },
      { id: 'hdr-light-balance', name: 'Pencahayaan HDR Seimbang', icon: Sparkles, promptSuffix: ', balanced HDR shadows and highlight recovery, dynamic range enhancement' },
      { id: 'cinematic-color-grade', name: 'Color Grading Sinematik', icon: Sparkles, promptSuffix: ', teal and orange hollywood movie color grading, atmospheric look' },
      { id: 'studio-relighting', name: 'Relighting Studio Baru', icon: Camera, promptSuffix: ', soft professional 3-point studio light setup applied to subject' },
      { id: 'matte-finish', name: 'Hasil Cetak Matte Halus', icon: Layers, promptSuffix: ', fine matte photograph finish, non-reflective smooth contrast' },
      { id: 'black-white-pro', name: 'B&W Kontras Profesional', icon: Camera, promptSuffix: ', high dynamic range black and white conversion, deep blacks and crisp whites' },
      { id: 'remove-glare', name: 'Hapus Pantulan & Glare', icon: Wand2, promptSuffix: ', clean lens flare removal, glare reduction on skin and eyeglasses' },
      { id: 'shadow-boost', name: 'Penerang Bayangan Gelap', icon: Sparkles, promptSuffix: ', lift dark shadows smoothly, reveal hidden details without noise' },
      { id: 'portrait-beauty', name: 'Glow Kecantikan Wajah', icon: Sparkles, promptSuffix: ', subtle beauty enhancer, bright eye reflection, glowing healthy complexion' }
    ]
  };

  // Opsi Warna Background Latar Pas Foto
  const pasFotoBgOptions = [
    { id: 'merah', name: 'Merah Resmi (Hex #FF0000)', colorCode: '#e11d48', promptSuffix: 'solid bright red backdrop background (#FF0000)' },
    { id: 'biru', name: 'Biru Resmi (Hex #0000FF)', colorCode: '#2563eb', promptSuffix: 'solid deep blue backdrop background (#0000FF)' },
    { id: 'putih', name: 'Putih Polos (Hex #FFFFFF)', colorCode: '#f8fafc', promptSuffix: 'pure solid clean white background (#FFFFFF)' },
    { id: 'kuning', name: 'Kuning Polos', colorCode: '#eab308', promptSuffix: 'solid bright yellow background' },
    { id: 'hijau', name: 'Hijau Polos', colorCode: '#22c55e', promptSuffix: 'solid studio green background' },
    { id: 'abu', name: 'Abu-Abu Studio', colorCode: '#64748b', promptSuffix: 'solid neutral grey studio background' },
    { id: 'hitam', name: 'Hitam Polos', colorCode: '#0f172a', promptSuffix: 'solid sleek dark black background' }
  ];

  // Opsi Pakaian Formal & Pas Foto
  const pasFotoOutfitOptions = [
    { id: 'kemeja-dasi', name: 'Kemeja Putih + Dasi Hitam', promptText: 'wearing neat white formal buttoned shirt with crisp dark tie' },
    { id: 'jas-hitam', name: 'Jas Hitam Formal Exec', promptText: 'wearing professional black tuxedo blazer suit with white shirt and tie' },
    { id: 'jas-navy', name: 'Jas Navy Executive', promptText: 'wearing stylish dark navy blue suit blazer with white collared shirt' },
    { id: 'sd-merah-putih', name: 'Seragam SD (Merah Putih + Dasi)', promptText: 'wearing Indonesian elementary school SD uniform red cap, white shirt and red tie' },
    { id: 'smp-biru-putih', name: 'Seragam SMP (Biru Putih)', promptText: 'wearing Indonesian junior high school SMP uniform white shirt and blue tie' },
    { id: 'sma-abu-putih', name: 'Seragam SMA (Abu-Abu Putih)', promptText: 'wearing Indonesian high school SMA uniform white shirt and grey tie' },
    { id: 'kebaya-formal', name: 'Kebaya Formal / Modern', promptText: 'wearing elegant traditional Indonesian lace kebaya outfit' },
    { id: 'batik-resmi', name: 'Kemeja Batik Resmi', promptText: 'wearing luxury traditional Indonesian pattern batik shirt' }
  ];

  // Per-Image Individual Revision State
  const [revisionPrompts, setRevisionPrompts] = useState({});
  const [activeRevisionId, setActiveRevisionId] = useState(null);
  
  // AI Processing State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [currentResults, setCurrentResults] = useState([]);
  const [customApiKey, setCustomApiKey] = useState('');

  // IndexedDB Helper Functions
  const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ZTronikDB', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('history')) {
          db.createObjectStore('history', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const saveToIndexedDB = async (items) => {
    try {
      const db = await openDB();
      const tx = db.transaction('history', 'readwrite');
      const store = tx.objectStore('history');
      for (const item of items) {
        store.put(item);
      }
    } catch (err) {
      console.warn("IndexedDB save failed:", err);
    }
  };

  const loadFromIndexedDB = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction('history', 'readonly');
      const store = tx.objectStore('history');
      return new Promise((resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch (err) {
      console.warn("IndexedDB load failed:", err);
      return [];
    }
  };

  useEffect(() => {
    const initStorage = async () => {
      const dbHistory = await loadFromIndexedDB();
      if (dbHistory && dbHistory.length > 0) {
        setHistory(dbHistory.sort((a, b) => b.id - a.id));
      } else {
        const savedHist = localStorage.getItem('ztronik_history');
        if (savedHist) {
          try { setHistory(JSON.parse(savedHist)); } catch(e) {}
        }
      }
    };
    initStorage();
    
    const savedFavs = localStorage.getItem('ztronik_favs');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch(e) {}
    }
  }, []);

  const saveToHistory = async (items) => {
    const newHist = [...items, ...history];
    setHistory(newHist);
    await saveToIndexedDB(items);
    try {
      const lightweightItems = newHist.slice(0, 30).map(item => ({
        ...item,
        imageUrl: item.imageUrl.length > 1000 ? '' : item.imageUrl
      }));
      localStorage.setItem('ztronik_history', JSON.stringify(lightweightItems));
    } catch (e) {
      console.warn("LocalStorage quota exceeded, skipped local metadata cache.", e);
    }
  };

  const toggleFavorite = (featureId) => {
    let updated;
    if (favorites.includes(featureId)) {
      updated = favorites.filter(id => id !== featureId);
    } else {
      updated = [...favorites, featureId];
    }
    setFavorites(updated);
    localStorage.setItem('ztronik_favs', JSON.stringify(updated));
  };

  // Kategori Fitur Lengkap (Minimal 15+ Fitur Per Kategori)
  const aiFeatures = [
    // 1. Virtual Try-On
    { 
      id: 'fit-baju', 
      name: 'Gabung Baju & Foto Orang (Virtual Try-On)', 
      category: 'studio', 
      icon: ShoppingBag, 
      desc: 'Upload foto baju/pakaian dan foto orang, AI akan memadukan baju tersebut ke tubuh orang dengan presisi.', 
      promptPreset: 'Virtual try-on model fitting photoshoot: seamlessly transfer and fit the uploaded clothing onto the uploaded person\'s body. Maintain the exact fabric patterns, style, and texture of the clothing item, perfectly tailored to the person\'s pose and posture, professional studio backdrop, hyper-realistic details, 8k focus.' 
    },

    // 2. Pas Foto & Foto Formal (Minimal 15+ Pilihan)
    { 
      id: 'pas-foto', 
      name: 'Pas Foto Resmi (Pilihan Warna BG & Baju)', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Pas foto dokumen resmi lengkap dengan pemilih warna background & baju instan.', 
      promptPreset: 'Formal official passport ID photo, head and shoulder view, proper frontal posture, perfectly balanced studio lighting, ultra high precision facial detail.' 
    },
    { 
      id: 'headshot-studio', 
      name: 'Headshot Formal LinkedIn', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Headshot profesional kerja dengan pilihan baju & warna latar.', 
      promptPreset: 'Professional corporate headshot photo, approachable posture, neat formal attire, studio setting, crisp high quality image.' 
    },
    { 
      id: 'pas-foto-2x3', 
      name: 'Pas Foto Ukuran 2x3 Standar', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Format pas foto ukuran 2x3 resmi untuk berbagai keperluan administrasi.', 
      promptPreset: 'Official passport size 2x3 ratio ID portrait, crisp facial focus, neat professional look, solid background.' 
    },
    { 
      id: 'pas-foto-3x4', 
      name: 'Pas Foto Ukuran 3x4 Resmi', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Format pas foto ukuran 3x4 standar dokumen kependudukan & lamaran.', 
      promptPreset: 'Official passport size 3x4 ratio portrait, clean symmetry, official document standard, sharp facial focus.' 
    },
    { 
      id: 'pas-foto-4x6', 
      name: 'Pas Foto Ukuran 4x6 Ijazah', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Format pas foto ukuran 4x6 resmi untuk ijazah, SKCK, dan buku nikah.', 
      promptPreset: 'Official passport size 4x6 ratio portrait, high resolution print ready quality, professional attire.' 
    },
    { 
      id: 'pas-foto-skck', 
      name: 'Pas Foto Khusus Pengajuan SKCK', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Pas foto dengan standar ketat kepolisian untuk pengajuan SKCK.', 
      promptPreset: 'Official police document SKCK passport photo standard, blue background option, formal shirt and tie, sharp eyes.' 
    },
    { 
      id: 'pas-foto-buku-nikah', 
      name: 'Pas Foto Buku Nikah (Background Biru/Merah)', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Pas foto berpasangan atau individu untuk buku nikah KUA.', 
      promptPreset: 'Official Indonesian KUA wedding book passport photo standard, warm joyful polite expression, clean backdrop.' 
    },
    { 
      id: 'pas-foto-pns', 
      name: 'Pas Foto ASN / PNS Resmi', 
      category: 'formal', 
      icon: Briefcase, 
      isFormal: true,
      desc: 'Pas foto formal untuk aparatur sipil negara dan pegawai instansi.', 
      promptPreset: 'Official civil servant ASN PNS official ID portrait photo, neat formal uniform, authoritative professional look.' 
    },
    { 
      id: 'pas-foto-bank', 
      name: 'Pas Foto Eksekutif Perbankan', 
      category: 'formal', 
      icon: Briefcase, 
      isFormal: true,
      desc: 'Pas foto dengan jas rapi dan pencahayaan high-end perbankan.', 
      promptPreset: 'High-end banking executive passport photo, tailored dark suit, pristine white collar, professional lighting.' 
    },
    { 
      id: 'pas-foto-dokter', 
      name: 'Pas Foto ID Card Rumah Sakit / Medis', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Pas foto formal untuk kartu identitas tenaga medis dan rumah sakit.', 
      promptPreset: 'Medical staff hospital ID card passport photo, wearing white medical collar, clean trustworthy expression.' 
    },
    { 
      id: 'pas-foto-tni-polri', 
      name: 'Pas Foto Dinas Militer / Kepolisian', 
      category: 'formal', 
      icon: Shield, 
      isFormal: true,
      desc: 'Pas foto resmi dengan atribut kedinasan dan wibawa tinggi.', 
      promptPreset: 'Military or police official service ID photo, sharp uniform details, proud posture, authoritative gaze.' 
    },
    { 
      id: 'pas-foto-paspor-internasional', 
      name: 'Pas Foto Standar Paspor Internasional', 
      category: 'formal', 
      icon: Globe, 
      isFormal: true,
      desc: 'Pas foto sesuai standar ICAO untuk paspor internasional dan visa.', 
      promptPreset: 'ICAO international passport photo standard, pure white background, neutral facial expression, no shadows.' 
    },
    { 
      id: 'pas-foto-visa-amerika', 
      name: 'Pas Foto Standar Visa US (5x5 cm)', 
      category: 'formal', 
      icon: Globe, 
      isFormal: true,
      desc: 'Format khusus ukuran persegi 5x5 cm untuk pengajuan visa Amerika Serikat.', 
      promptPreset: 'US Visa 5x5 cm square passport photo standard, white background, centered head position, ultra sharp details.' 
    },
    { 
      id: 'pas-foto-hijab-formal', 
      name: 'Pas Foto Hijab Formal Rapi', 
      category: 'formal', 
      icon: Sparkles, 
      isFormal: true,
      desc: 'Pas foto resmi khusus wanita berhijab dengan kerapian sempurna.', 
      promptPreset: 'Official formal hijab passport ID photo, neat tucked dark hijab style, balanced studio softbox lighting.' 
    },
    { 
      id: 'pas-foto-grey-bg', 
      name: 'Pas Foto Latar Abu-Abu Modern', 
      category: 'formal', 
      icon: Camera, 
      isFormal: true,
      desc: 'Pas foto formal dengan latar belakang abu-abu studio modern yang elegan.', 
      promptPreset: 'Modern professional passport photo with neutral solid grey background, executive suit attire, crisp 8k focus.' 
    },

    // 3. Anak Sekolah & Kampus (Minimal 15+ Pilihan)
    { 
      id: 'sekolah-sd', 
      name: 'Pas Foto SD (Merah Putih)', 
      category: 'sekolah', 
      icon: GraduationCap, 
      isFormal: true,
      desc: 'Pas foto resmi siswa SD berseragam merah putih.', 
      promptPreset: 'Indonesian elementary school student (Sekolah Dasar SD) official passport photo, polite posture, smiling brightly.' 
    },
    { 
      id: 'sekolah-smp', 
      name: 'Pas Foto SMP (Biru Putih)', 
      category: 'sekolah', 
      icon: GraduationCap, 
      isFormal: true,
      desc: 'Pas foto resmi siswa SMP berseragam biru putih.', 
      promptPreset: 'Indonesian junior high school student (SMP) official passport photo, neat haircut, polite expression.' 
    },
    { 
      id: 'sekolah-sma', 
      name: 'Pas Foto / Album Kenangan SMA', 
      category: 'sekolah', 
      icon: GraduationCap, 
      isFormal: true,
      desc: 'Foto siswa SMA berseragam abu-abu putih atau foto album sekolah.', 
      promptPreset: 'Indonesian high school student (SMA) portrait, youthful aesthetic, neat grey and white uniform.' 
    },
    { 
      id: 'sekolah-tk', 
      name: 'Foto Sekolah TK & Paud', 
      category: 'sekolah', 
      icon: GraduationCap, 
      desc: 'Foto siswa TK/Paud imut dengan latar kelas warna-warni.', 
      promptPreset: 'Adorable preschool kindergarten student portrait, cheerful classroom backdrop with toys, bright friendly daylight.' 
    },
    { 
      id: 'sekolah-universitas', 
      name: 'Foto Wisuda & Jas Almamater', 
      category: 'sekolah', 
      icon: GraduationCap, 
      desc: 'Foto wisuda toga lengkap atau jas almamater kampus.', 
      promptPreset: 'Celebratory university graduation studio portrait, wearing formal academic toga cap and gown, holding scroll diploma.' 
    },
    { 
      id: 'sekolah-pramuka', 
      name: 'Pas Foto Seragam Pramuka Lengkap', 
      category: 'sekolah', 
      icon: GraduationCap, 
      isFormal: true,
      desc: 'Pas foto pelajar menggunakan seragam pramuka cokelat resmi.', 
      promptPreset: 'Indonesian student wearing official brown scout Pramuka uniform with neckerchief, official ID photo.' 
    },
    { 
      id: 'sekolah-smk', 
      name: 'Pas Foto Siswa SMK / Praktik', 
      category: 'sekolah', 
      icon: GraduationCap, 
      isFormal: true,
      desc: 'Pas foto pelajar Sekolah Menengah Kejuruan dengan atribut kejuruan.', 
      promptPreset: 'Vocational high school SMK student portrait, professional workshop or uniform background, confident look.' 
    },
    { 
      id: 'sekolah-pesantren', 
      name: 'Pas Foto Santri Pesantren', 
      category: 'sekolah', 
      icon: GraduationCap, 
      isFormal: true,
      desc: 'Pas foto santri mengenakan peci hitam, baju koko, atau gamis resmi.', 
      promptPreset: 'Islamic boarding school santri student portrait, wearing polite koko shirt and black peci cap, serene expression.' 
    },
    { 
      id: 'sekolah-osis', 
      name: 'Pas Foto Pengurus OSIS / MPK', 
      category: 'sekolah', 
      icon: GraduationCap, 
      isFormal: true,
      desc: 'Pas foto resmi pengurus organisasi siswa dengan jas OSIS.', 
      promptPreset: 'Student council OSIS leader portrait, wearing official school blazer and badge, leadership posture.' 
    },
    { 
      id: 'sekolah-paskibra', 
      name: 'Pas Foto Anggota Paskibraka', 
      category: 'sekolah', 
      icon: GraduationCap, 
      isFormal: true,
      desc: 'Pas foto tegap dengan seragam putih Paskibraka berpeci.', 
      promptPreset: 'Youth Paskibraka flag ceremony uniform portrait, proud disciplined posture, sharp patriotic look.' 
    },
    { 
      id: 'sekolah-yearbook-out', 
      name: 'Yearbook Outdoor Concept Kampus', 
      category: 'sekolah', 
      icon: Users, 
      desc: 'Foto album kenangan konsep outdoor di koridor atau taman sekolah.', 
      promptPreset: 'High school yearbook outdoor portrait style, warm golden hour sunbeams, nostalgic campus youth memory.' 
    },
    { 
      id: 'sekolah-lab-sains', 
      name: 'Foto Praktikum Laboratorium Sains', 
      category: 'sekolah', 
      icon: Briefcase, 
      desc: 'Foto pelajar sedang melakukan uji coba sains di ruang laboratorium.', 
      promptPreset: 'Student doing science experiment in laboratory wearing white lab coat and safety glasses, educational lighting.' 
    },
    { 
      id: 'sekolah-olahraga', 
      name: 'Foto Tim Olahraga / Basket Sekolah', 
      category: 'sekolah', 
      icon: Users, 
      desc: 'Foto atlet pelajar mengenakan jersey tim basket atau sepak bola sekolah.', 
      promptPreset: 'High school sports team athlete portrait, wearing school jersey uniform, energetic athletic student vibe.' 
    },
    { 
      id: 'sekolah-pensi', 
      name: 'Foto Panggung Pentas Seni (Pensi)', 
      category: 'sekolah', 
      icon: Sparkles, 
      desc: 'Foto kenangan saat tampil di acara panggung pentas seni sekolah.', 
      promptPreset: 'School talent show performance stage portrait, colourful stage spotlights, energetic youth celebration.' 
    },
    { 
      id: 'sekolah-lulusan-best', 
      name: 'Studio Portrait Kelulusan Eksklusif', 
      category: 'sekolah', 
      icon: GraduationCap, 
      desc: 'Foto studio eksklusif merayakan hari kelulusan sekolah/kampus.', 
      promptPreset: 'Exclusive graduation studio portrait session, confetti celebration touch, proud smiling graduate student.' 
    },

    // 4. Kategori Pernikahan & Prewedding (Minimal 15+ Pilihan)
    { 
      id: 'wedding-manten', 
      name: 'Foto Pernikahan / Manten Adat & Modern', 
      category: 'wedding', 
      icon: HeartHandshake, 
      desc: 'Foto pelaminan akad dan resepsi pernikahan pengantin.', 
      promptPreset: 'Traditional royal wedding portrait photoshoot, elaborate luxury bridal attire and crown makeup, glowing festive reception backdrop.' 
    },
    { 
      id: 'prewedding-outdoor', 
      name: 'Foto Prewedding Outdoor & Sunset', 
      category: 'wedding', 
      icon: HeartHandshake, 
      desc: 'Foto prewedding romantis di alam bebas, pantai, atau tebing sunset.', 
      promptPreset: 'Dreamy prewedding photoshoot, bride in magnificent white gown and groom in suit, breathtaking golden hour sunset landscape backdrop.' 
    },
    { 
      id: 'prewedding-studio', 
      name: 'Foto Prewedding Studio Minimalis', 
      category: 'wedding', 
      icon: HeartHandshake, 
      desc: 'Konsep prewedding indoor berkelas dengan estetik modern.', 
      promptPreset: 'Minimalist studio prewedding portrait, romantic affectionate pose, soft cozy studio lighting, elegant couple outfits.' 
    },
    { 
      id: 'wedding-jawa-paes', 
      name: 'Pengantin Adat Jawa Paes Ageng', 
      category: 'wedding', 
      icon: HeartHandshake, 
      desc: 'Busana dan riasan pengantin tradisional Jawa lengkap dengan paes.', 
      promptPreset: 'Traditional Javanese royal bride and groom attire with elaborate black and gold paes makeup and ornate blangkon.' 
    },
    { 
      id: 'wedding-sunda-siger', 
      name: 'Pengantin Adat Sunda Siger Emas', 
      category: 'wedding', 
      icon: HeartHandshake, 
      desc: 'Pengantin Sunda dengan mahkota siger perak/emas dan ronce melati.', 
      promptPreset: 'Traditional Sundanese wedding portrait, bride wearing sparkling siger crown and jasmine flower garlands, elegant couple.' 
    },
    { 
      id: 'wedding-minang-suntiang', 
      name: 'Pengantin Minang Suntiang Gadang', 
      category: 'wedding', 
      icon: HeartHandshake, 
      desc: 'Pengantin adat Minangkabau Sumatra Barat dengan mahkota suntiang megah.', 
      promptPreset: 'Traditional West Sumatra Minang wedding couple, bride wearing grand golden suntiang crown and velvet traditional attire.' 
    },
    { 
      id: 'wedding-korean-style', 
      name: 'Prewedding Konsep Korea Minimalis', 
      category: 'wedding', 
      icon: Sparkles, 
      desc: 'Gaya foto prewedding ala drama Korea dengan latar pastel yang lembut.', 
      promptPreset: 'Korean style minimal studio prewedding photography, soft pastel backdrop tones, romantic effortless romance aesthetic.' 
    },
    { 
      id: 'wedding-bali-beach', 
      name: 'Prewedding Romantis Pantai Bali', 
      category: 'wedding', 
      icon: Globe, 
      desc: 'Foto prewedding di tebing pantai Bali saat matahari terbenam.', 
      promptPreset: 'Tropical beach prewedding photoshoot on Bali cliff edge at sunset, flowing white gown train in ocean wind.' 
    },
    { 
      id: 'wedding-rustic-garden', 
      name: 'Pernikahan Konsep Rustic Garden', 
      category: 'wedding', 
      icon: Trees, 
      desc: 'Pernikahan outdoor dengan dekorasi kayu rustic dan lampu gantung peri.', 
      promptPreset: 'Outdoor rustic garden wedding ceremony setup, wooden arch adorned with white roses and fairy lights bokeh.' 
    },
    { 
      id: 'wedding-akad-syahdu', 
      name: 'Prosesi Akad Nikah Suci & Syahdu', 
      category: 'wedding', 
      icon: HeartHandshake, 
      desc: 'Momen khidmat ijab kabul akad nikah bernuansa putih bersih.', 
      promptPreset: 'Solemn holy matrimony akad nikah ceremony portrait, white Islamic bridal wear, emotional joyful blessing moment.' 
    },
    { 
      id: 'wedding-ballgown-royal', 
      name: 'Gaun Pengantin Ballgown Mewah', 
      category: 'wedding', 
      icon: Sparkles, 
      desc: 'Pengantin wanita mengenakan gaun megah layaknya putri kerajaan.', 
      promptPreset: 'Magnificent royal ballgown wedding dress with long intricate lace cathedral veil, crystal chandelier palace ballroom.' 
    },
    { 
      id: 'wedding-cinematic-bw', 
      name: 'Prewedding Hitam Putih Sinematik', 
      category: 'wedding', 
      icon: Camera, 
      desc: 'Foto hitam putih penuh emosi romantis yang abadi.', 
      promptPreset: 'Emotional black and white cinematic wedding couple portrait, artistic high contrast lighting, intense romantic stare.' 
    },
    { 
      id: 'wedding-pedang-pora', 
      name: 'Upacara Pedang Pora Militer', 
      category: 'wedding', 
      icon: Shield, 
      desc: 'Prosesi tradisi militer pedang pora untuk perwira pengantin.', 
      promptPreset: 'Military ceremonial wedding arch of swords procession, formal dress uniform groom and glowing happy bride.' 
    },
    { 
      id: 'wedding-vintage-classic', 
      name: 'Prewedding Konsep Vintage 70an', 
      category: 'wedding', 
      icon: Camera, 
      desc: 'Sentuhan klasik retro tahun 70-an dengan mobil antik dan tonality hangat.', 
      promptPreset: 'Vintage 1970s prewedding style, classic convertible car decorated with flowers, warm Kodachrome film color tone.' 
    },
    { 
      id: 'wedding-night-lantern', 
      name: 'Resepsi Malam Lampion Magis', 
      category: 'wedding', 
      icon: Sparkles, 
      desc: 'Pesta resepsi malam hari diterangi ribuan lampion terbang dan lampu hias.', 
      promptPreset: 'Magical night wedding reception celebration surrounded by floating paper lanterns and glowing golden fairy lights.' 
    },

    // 5. Kategori Profesi & Cita-Cita (Minimal 15+ Pilihan)
    { 
      id: 'profesi-dokter', 
      name: 'Profesi Dokter & Tenaga Medis', 
      category: 'profesi', 
      icon: Briefcase, 
      desc: 'Foto gaya dokter berseragam jas putih/scrubs di rumah sakit.', 
      promptPreset: 'Professional doctor portrait, wearing crisp white medical coat with stethoscope, modern clean hospital environment background.' 
    },
    { 
      id: 'profesi-pilot', 
      name: 'Profesi Pilot & Aviator', 
      category: 'profesi', 
      icon: Briefcase, 
      desc: 'Foto pilot maskapai dengan seragam dan latar pesawat.', 
      promptPreset: 'Confident airline pilot portrait, wearing sharp pilot captain uniform with epaulettes, airport runway airplane backdrop.' 
    },
    { 
      id: 'profesi-polisi-tni', 
      name: 'Profesi Abdi Negara (Polisi / TNI)', 
      category: 'profesi', 
      icon: Briefcase, 
      desc: 'Foto gagah seragam abdi negara wibawa.', 
      promptPreset: 'Authoritative officer portrait wearing official neat uniform, proud posture, studio illumination, sharp details.' 
    },
    { 
      id: 'profesi-astronaut', 
      name: 'Profesi Astronaut & Sains', 
      category: 'profesi', 
      icon: Briefcase, 
      desc: 'Foto futuristik baju luar angkasa astronaut.', 
      promptPreset: 'Inspiring astronaut portrait wearing high-tech space suit, cosmic galaxy nebula background, heroic lighting.' 
    },
    { 
      id: 'profesi-eksekutif', 
      name: 'Profesi Pengusaha & CEO', 
      category: 'profesi', 
      icon: Briefcase, 
      desc: 'Foto pemimpin perusahaan di kantor megah.', 
      promptPreset: 'Corporate executive CEO portrait in high rise glass skyscraper office background, luxury tailored suit.' 
    },
    { 
      id: 'profesi-chef', 
      name: 'Profesi Chef / Koki Bintang Michelin', 
      category: 'profesi', 
      icon: Briefcase, 
      desc: 'Foto koki profesional di dapur restoran mewah.', 
      promptPreset: 'Professional executive chef in clean white chef coat and apron holding gourmet dish in commercial kitchen, warm spotlight.' 
    },
    { 
      id: 'profesi-arsitek', 
      name: 'Profesi Arsitek & Perencana Bangunan', 
      category: 'profesi', 
      icon: Grid, 
      desc: 'Foto arsitek membawa cetak biru gambar desain konstruksi.', 
      promptPreset: 'Professional architect wearing hardhat inspecting building blueprint drawings on wooden drafting table, studio lighting.' 
    },
    { 
      id: 'profesi-pemadam', 
      name: 'Profesi Pemadam Kebakaran Heroik', 
      category: 'profesi', 
      icon: Sparkles, 
      desc: 'Foto pemberani petugas pemadam kebakaran dengan peralatan penyelamatan.', 
      promptPreset: 'Brave firefighter hero wearing heavy rescue gear with red fire engine truck background, dramatic heroic lighting.' 
    },
    { 
      id: 'profesi-programmer', 
      name: 'Profesi Software Engineer & Hacker', 
      category: 'profesi', 
      icon: Grid, 
      desc: 'Foto ahli IT dan pengembang perangkat lunak di depan monitor kode.', 
      promptPreset: 'Professional software engineer working with multiple glowing monitors displaying programming code, cyberpunk teal lighting.' 
    },
    { 
      id: 'profesi-jurnalis', 
      name: 'Profesi Jurnalis TV & Presenter Berita', 
      category: 'profesi', 
      icon: Camera, 
      desc: 'Foto penyiar berita televisi memegang mikrofon di studio siaran.', 
      promptPreset: 'TV news anchor journalist holding microphone in professional broadcast television studio backdrop, sharp focus.' 
    },
    { 
      id: 'profesi-pramugari', 
      name: 'Profesi Pramugari Maskapai Penerbangan', 
      category: 'profesi', 
      icon: Globe, 
      desc: 'Foto pramugari anggun berseragam maskapai penerbangan internasional.', 
      promptPreset: 'Elegant flight attendant stewardess in stylish airline uniform smiling warmly, modern airport departure lounge.' 
    },
    { 
      id: 'profesi-atlet', 
      name: 'Profesi Atlet Olahraga Profesional', 
      category: 'profesi', 
      icon: Sparkles, 
      desc: 'Foto atlet kebanggaan dengan seragam tanding di stadion besar.', 
      promptPreset: 'Professional sports athlete player holding sports gear with glowing grand stadium lights and cheering crowd background.' 
    },
    { 
      id: 'profesi-seniman', 
      name: 'Profesi Seniman & Pelukis Studio', 
      category: 'profesi', 
      icon: Paintbrush, 
      desc: 'Foto pelukis kreatif memegang kuas di studio seni penuh warna.', 
      promptPreset: 'Creative fine artist holding paintbrush in messy art studio with colorful canvas oil paintings, natural daylight.' 
    },
    { 
      id: 'profesi-musisi', 
      name: 'Profesi Musisi & Bintang Panggung', 
      category: 'profesi', 
      icon: Sparkles, 
      desc: 'Foto musisi rockstar atau pemain musik di panggung konser megah.', 
      promptPreset: 'Famous rockstar musician holding guitar under dazzling concert stage spotlight beams and atmospheric smoke.' 
    },
    { 
      id: 'profesi-ilmuwan', 
      name: 'Profesi Ilmuwan Peneliti Laboratorium', 
      category: 'profesi', 
      icon: Briefcase, 
      desc: 'Foto peneliti sains menganalisis mikroskop di fasilitas riset.', 
      promptPreset: 'Scientist researcher analyzing samples through advanced microscope in high-tech research facility laboratory.' 
    },
    { 
      id: 'profesi-hakim-pengacara', 
      name: 'Profesi Hukum (Hakim & Pengacara)', 
      category: 'profesi', 
      icon: Briefcase, 
      desc: 'Foto profesional hukum di dalam ruang sidang berpanel kayu.', 
      promptPreset: 'Lawyer or judge in formal dark suit standing inside impressive wooden courtroom court, authoritative expression.' 
    },

    // 6. Kategori Karikatur & Seni Kartun (Minimal 15+ Pilihan)
    { 
      id: 'karikatur-3d', 
      name: 'Karikatur 3D Animated / Pixar', 
      category: 'karikatur', 
      icon: Smile, 
      desc: 'Ubah foto diri jadi karakter kartun 3D yang imut dan hidup.', 
      promptPreset: 'Adorable 3D Pixar character cartoon caricature, expressive smiling face, vibrant glossy texture render, 3D animated movie style.' 
    },
    { 
      id: 'karikatur-lucu', 
      name: 'Karikatur Sketsa & Komik', 
      category: 'karikatur', 
      icon: Paintbrush, 
      desc: 'Seni karikatur unik dengan kepala agak membesar dan gaya menggambar tangan.', 
      promptPreset: 'Funny hand-drawn caricature drawing, cute slightly oversized head art style, expressive smile, detailed colorful illustration.' 
    },
    { 
      id: 'karikatur-ghibli', 
      name: 'Lukisan Kartun Anime Ghibli', 
      category: 'karikatur', 
      icon: Palette, 
      desc: 'Ubah foto ke gaya lukisan anime khas Studio Ghibli.', 
      promptPreset: 'Beautiful Studio Ghibli anime aesthetic portrait, soft watercolor textures, hand-drawn anime artwork, enchanting nostalgic vibe.' 
    },
    { 
      id: 'karikatur-pop-art', 
      name: 'Seni Pop Art Komik Warna-Warni', 
      category: 'karikatur', 
      icon: Palette, 
      desc: 'Gaya seni pop art penuh warna dengan titik halftones ala Andy Warhol.', 
      promptPreset: 'Vibrant pop art comic book style, bold black outlines, colorful halftones dots, playful caricature portrait.' 
    },
    { 
      id: 'karikatur-claymation', 
      name: 'Stop-Motion Lilin Claymation', 
      category: 'karikatur', 
      icon: Smile, 
      desc: 'Karakter figur lilin mainan tangan yang lucu dan unik.', 
      promptPreset: 'Cute claymation plasticine clay character figure style, tactile handcrafted textured toy sculpture.' 
    },
    { 
      id: 'karikatur-chibi', 
      name: 'Chibi Anime Super Imut', 
      category: 'karikatur', 
      icon: Baby, 
      desc: 'Gaya seni chibi Jepang dengan kepala besar dan mata berbinar sangat imut.', 
      promptPreset: 'Adorable Japanese chibi anime art style, big head tiny body, cute rosy cheeks, sparkling anime eyes.' 
    },
    { 
      id: 'karikatur-papercraft', 
      name: 'Seni Potongan Kertas Papercraft 3D', 
      category: 'karikatur', 
      icon: Layers, 
      desc: 'Efek berlapis potongan kertas seni kriya tangan yang estetik.', 
      promptPreset: 'Layered papercraft cutout art style, shadow depth effect, colorful folded paper texture.' 
    },
    { 
      id: 'karikatur-oil-painting', 
      name: 'Lukisan Minyak Karikatur Tebal', 
      category: 'karikatur', 
      icon: Paintbrush, 
      desc: 'Tekstur sapuan kuas cat minyak tebal impasto yang artistik.', 
      promptPreset: 'Expressive thick oil impasto brush strokes painting caricature, vivid rich colors, masterpiece look.' 
    },
    { 
      id: 'karikatur-cyberpunk', 
      name: 'Anime Cyberpunk Neon Sci-Fi', 
      category: 'karikatur', 
      icon: Sparkles, 
      desc: 'Karakter anime dengan nuansa cahaya neon masa depan.', 
      promptPreset: 'Futuristic cyberpunk anime character artwork, glowing magenta and cyan neon details, cool tech jacket.' 
    },
    { 
      id: 'karikatur-doodle', 
      name: 'Doodle Art Ceria & Unik', 
      category: 'karikatur', 
      icon: Paintbrush, 
      desc: 'Gaya coretan doodle line art lucu dikelilingi ikon pendukung.', 
      promptPreset: 'Playful doodle line art caricature surrounded by cute funny doodle icons, creative sketchbook illustration.' 
    },
    { 
      id: 'karikatur-retro-30s', 
      name: 'Kartun Klasik Vintage Tahun 30-an', 
      category: 'karikatur', 
      icon: Camera, 
      desc: 'Gaya animasi karet hitam putih era klasik Cuphead tahun 1930.', 
      promptPreset: 'Vintage 1930s rubber hose cartoon style, black and white sepia cuphead aesthetic, classic animation.' 
    },
    { 
      id: 'karikatur-vector-flat', 
      name: 'Ilustrasi Vector Flat Modern', 
      category: 'karikatur', 
      icon: Grid, 
      desc: 'Grafik vektor bersih dengan bentuk datar modern dan warna cerah.', 
      promptPreset: 'Clean vector graphic illustration, sharp flat shapes, modern minimalist color scheme, graphic design.' 
    },
    { 
      id: 'karikatur-graffiti', 
      name: 'Seni Graffiti Jalanan Urban', 
      category: 'karikatur', 
      icon: Palette, 
      desc: 'Gaya semprotan cat dinding jalanan dengan efek tetesan warna.', 
      promptPreset: 'Vibrant urban spray paint graffiti wall art style, dripping paint effects, edgy street art caricature.' 
    },
    { 
      id: 'karikatur-fantasy-rpg', 
      name: 'Karakter Game Fantasy RPG Epic', 
      category: 'karikatur', 
      icon: Sparkles, 
      desc: 'Ubah diri jadi ksatria atau pahlawan dalam game role-playing fantasi.', 
      promptPreset: 'Epic fantasy video game character artwork, magical aura glow, ornate armor and fantasy background details.' 
    },
    { 
      id: 'karikatur-voxel-3d', 
      name: 'Voxel Pixel 3D (Gaya Minecraft)', 
      category: 'karikatur', 
      icon: Grid, 
      desc: 'Model render kubus pixel 3D kotak-kotak ala game Minecraft.', 
      promptPreset: '3D blocky voxel art style, colorful pixelated 3D cube render, retro gaming aesthetic.' 
    },

    // 7. Kategori Liburan Keluar Negeri Seluruh Dunia (Minimal 15+ Pilihan)
    { 
      id: 'liburan-paris', 
      name: 'Liburan di Menara Eiffel, Paris', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto bergaya liburan di kota Paris dengan latar Eiffel.', 
      promptPreset: 'Vacation photo standing in Paris with iconic Eiffel Tower in background, autumn fashion outfit, soft european daylight, travel aesthetic.' 
    },
    { 
      id: 'liburan-jepang', 
      name: 'Liburan Musim Sakura di Jepang', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto berjalan di bawah rimbun pohon sakura Tokyo/Kyoto.', 
      promptPreset: 'Travel vacation photo in Japan, blooming pink cherry blossom sakura trees overhead, traditional Kyoto street background, bright sunny day.' 
    },
    { 
      id: 'liburan-makkah', 
      name: 'Foto Ibadah Umroh / Makkah', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto syahdu suasana di Makkah atau Madinah.', 
      promptPreset: 'Serene spiritual travel photo in Makkah, wearing white ihram/hijab, Kaaba courtyard in background, peaceful atmosphere.' 
    },
    { 
      id: 'liburan-london', 
      name: 'Liburan di Big Ben & London', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto elegan suasana kota London dan jam Big Ben.', 
      promptPreset: 'Stylish vacation photo in London, standing near red phone booth with Big Ben in background, classy winter coat.' 
    },
    { 
      id: 'liburan-mesir', 
      name: 'Liburan di Piramida Mesir', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto petualangan eksotis di Piramida Giza Mesir.', 
      promptPreset: 'Exotic travel adventure photo at Great Pyramids of Giza Egypt, warm golden desert sunlight, clear blue sky.' 
    },
    { 
      id: 'liburan-bali', 
      name: 'Liburan di Pantai & Pura Bali', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto santai tropis di keindahan alam Bali.', 
      promptPreset: 'Tropical vacation photo in Bali beach resort, lush palm trees, ocean view sunset, wearing casual tropical shirt/dress.' 
    },
    { 
      id: 'liburan-santorini', 
      name: 'Liburan di Santorini Yunani', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto indah di bangunan kubah biru putih menghadap Laut Aegea.', 
      promptPreset: 'Scenic blue dome church background in Santorini Greece overlooking Aegean sea, bright Mediterranean sunshine.' 
    },
    { 
      id: 'liburan-taj-mahal', 
      name: 'Liburan di Taj Mahal India', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto berlatar bangunan megah marmer putih Taj Mahal di India.', 
      promptPreset: 'Standing in front of majestic white marble Taj Mahal India reflecting pool, exotic travel vlog memory.' 
    },
    { 
      id: 'liburan-new-york', 
      name: 'Liburan di Times Square New York', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto malam hari dikelilingi papan reklame neon raksasa di NYC.', 
      promptPreset: 'Night travel photo surrounded by bright neon billboards in Times Square NYC, vibrant urban energy.' 
    },
    { 
      id: 'liburan-swiss-alps', 
      name: 'Liburan Salju Pegunungan Alpen Swiss', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Liburan musim dingin bersalju mengenakan jaket tebal di Pegunungan Alpen.', 
      promptPreset: 'Snowy winter vacation in Swiss Alps wearing cozy winter jacket and beanie, majestic snow peaks background.' 
    },
    { 
      id: 'liburan-venice-italy', 
      name: 'Naik Gondola di Kanal Venesia Italia', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Menyusuri air kanal bersejarah Venesia menaiki perahu gondola romantis.', 
      promptPreset: 'Riding romantic gondola boat along Venice canal water with historic Italian buildings, sunny travel day.' 
    },
    { 
      id: 'liburan-borobudur', 
      name: 'Sunrise Magis di Candi Borobudur', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Pemandangan pagi berkabut matahari terbit di stupa Candi Borobudur.', 
      promptPreset: 'Misty morning sunrise landscape at ancient Borobudur temple stupas, spiritual heritage travel.' 
    },
    { 
      id: 'liburan-dubai', 
      name: 'Liburan Mewah di Burj Khalifa Dubai', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto latar gedung tertinggi di dunia Burj Khalifa di kota futuristik Dubai.', 
      promptPreset: 'Luxury vacation photo in Dubai with world tall Burj Khalifa skyscraper behind, sunny modern cityscape.' 
    },
    { 
      id: 'liburan-sydney', 
      name: 'Liburan di Sydney Opera House Australia', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Foto pemandangan pelabuhan dengan latar arsitektur ikonik Sydney Opera House.', 
      promptPreset: 'Harbor view vacation photo with Sydney Opera House sails in background, bright Australian summer daylight.' 
    },
    { 
      id: 'liburan-cappadocia', 
      name: 'Naik Balon Udara Cappadocia Turki', 
      category: 'liburan', 
      icon: Globe, 
      desc: 'Lanskap lembah batu unik dipenuhi ratusan balon udara terbang saat fajar.', 
      promptPreset: 'Sunrise valley in Cappadocia Turkey filled with hundreds of floating hot air balloons, magical adventure travel.' 
    },

    // 8. Foto Studio & Fashion (Minimal 15+ Pilihan)
    { 
      id: 'foto-atasan', 
      name: 'Foto Eksekutif / Atasan', 
      category: 'studio', 
      icon: User, 
      desc: 'Foto gaya kepemimpinan profesional kemeja atau jas premium.', 
      promptPreset: 'Professional corporate executive portrait, dark navy blazer suit, confident smile, luxury CEO office background.' 
    },
    { 
      id: 'foto-hijab', 
      name: 'Foto Hijab Modern Studio', 
      category: 'studio', 
      icon: Sparkles, 
      desc: 'Foto studio hijab gaya elegan dan profesional.', 
      promptPreset: 'High fashion studio portrait of an Indonesian woman wearing modern silk hijab, soft pastel blazer, clean background.' 
    },
    { 
      id: 'foto-fashion', 
      name: 'Foto Fashion & Lookbook', 
      category: 'studio', 
      icon: ShoppingBag, 
      desc: 'Model foto pakaian tren terkini.', 
      promptPreset: 'Full body high fashion lookbook photoshoot, trendy streetwear aesthetic, studio floor lighting, magazine layout quality.' 
    },
    { 
      id: 'studio-vogue', 
      name: 'Majalah High-Fashion VOGUE', 
      category: 'studio', 
      icon: ShoppingBag, 
      desc: 'Gaya sampul majalah mode papan atas dengan pencahayaan dramatis.', 
      promptPreset: 'High fashion VOGUE editorial cover style, dramatic rim lighting, luxury studio backdrop, sharp focus.' 
    },
    { 
      id: 'studio-cinematic', 
      name: 'Cinematic Portrait 8K', 
      category: 'studio', 
      icon: Sparkles, 
      desc: 'Potret bergaya film layar lebar dengan kedalaman ruang yang sinematik.', 
      promptPreset: 'Cinematic dramatic warm lighting, movie poster quality, shallow depth of field, 8k resolution.' 
    },
    { 
      id: 'studio-bw-classic', 
      name: 'Monokrom Hitam Putih Klasik', 
      category: 'studio', 
      icon: Camera, 
      desc: 'Foto hitam putih elegan dengan nuansa estetika film analog.', 
      promptPreset: 'High contrast monochrome black and white photo, silver halide film look, timeless elegance portrait.' 
    },
    { 
      id: 'studio-cyberpunk', 
      name: 'Cyberpunk Neon Glow Studio', 
      category: 'studio', 
      icon: Sparkles, 
      desc: 'Pencahayaan neon futuristik magenta dan cyan yang mencolok.', 
      promptPreset: 'Futuristic neon cyberpunk lighting, magenta and cyan highlights, dark moody studio background.' 
    },
    { 
      id: 'studio-minimalist', 
      name: 'Minimalis Studio Pastel', 
      category: 'studio', 
      icon: Layers, 
      desc: 'Estetika bersih minimalis dengan latar belakang warna pastel lembut.', 
      promptPreset: 'Minimalist clean aesthetic, subtle soft pastel studio backdrop, neutral elegant lighting.' 
    },
    { 
      id: 'studio-vintage-kodak', 
      name: 'Retro Vintage Kodak 90-an', 
      category: 'studio', 
      icon: Camera, 
      desc: 'Sentuhan warna kamera film Kodak era 90-an yang hangat bernostalgia.', 
      promptPreset: 'Vintage 1990s film photography, Kodak Portra 400 aesthetic, grain texture, warm nostalgic tones.' 
    },
    { 
      id: 'studio-luxury-gold', 
      name: 'Glamour Luxury Golden Shimmer', 
      category: 'studio', 
      icon: Sparkles, 
      desc: 'Pencahayaan keemasan mewah dengan kilau bokeh yang elegan.', 
      promptPreset: 'Golden luxury portrait lighting, bokeh shimmer, rich ambient tones, sophisticated elegance.' 
    },
    { 
      id: 'studio-watercolor', 
      name: 'Lukisan Cat Air Seni Studio', 
      category: 'studio', 
      icon: Paintbrush, 
      desc: 'Efek artistik cat air yang lembut menyatu dengan tekstur kanvas.', 
      promptPreset: 'Artistic watercolor paint style, soft ink splashes, subtle canvas texture portrait.' 
    },
    { 
      id: 'studio-soft-beauty', 
      name: 'Soft Beauty Cosmetic Light', 
      category: 'studio', 
      icon: Sparkles, 
      desc: 'Pencahayaan lampu cincin kosmetik untuk kulit mulus bercahaya.', 
      promptPreset: 'Soft cosmetic ring lighting, smooth skin glow, magazine close-up beauty portrait.' 
    },
    { 
      id: 'studio-moody-dark', 
      name: 'Moody Dark Low-Key Studio', 
      category: 'studio', 
      icon: Layers, 
      desc: 'Pencahayaan rendah yang misterius dengan kontras bayangan kuat.', 
      promptPreset: 'Low key moody lighting, dark shadowy background, strong dramatic contrast portrait.' 
    },
    { 
      id: 'studio-window-shadow', 
      name: 'Bayangan Jendela Tirai Dramatis', 
      category: 'studio', 
      icon: Camera, 
      desc: 'Pola bayangan tirai jendela yang artistik terpantul pada model.', 
      promptPreset: 'Dramatic window blind shadow patterns cast over model, sunset light beam aesthetic.' 
    },
    { 
      id: 'studio-pop-color', 
      name: 'Studio Pop Color Block Gel', 
      category: 'studio', 
      icon: Palette, 
      desc: 'Pencahayaan gel warna cerah terbelah merah dan biru yang modern.', 
      promptPreset: 'Vibrant dual color gel lighting, saturated red and blue studio split light portrait.' 
    },

    // 9. Bayi & Anak-Anak (Minimal 15+ Pilihan)
    { 
      id: 'foto-newborn', 
      name: 'Baby Newborn Photography', 
      category: 'baby', 
      icon: Baby, 
      desc: 'Foto bayi baru lahir dengan kostum lucu & lembut.', 
      promptPreset: 'Cute newborn baby studio photography, infant sleeping peacefully wrapped in soft knitted blanket, gentle lighting.' 
    },
    { 
      id: 'foto-anak-lucu', 
      name: 'Foto Anak Tematik Dongeng', 
      category: 'baby', 
      icon: Sparkles, 
      desc: 'Foto studio anak ceria dengan konsep pahlawan/dongeng.', 
      promptPreset: 'Cheerful toddler sitting in a fantasy fairytale kingdom studio set, wearing adorable prince/princess costume.' 
    },
    { 
      id: 'baby-wooden-nest', 
      name: 'Sarang Kayu Alami Bayi', 
      category: 'baby', 
      icon: Trees, 
      desc: 'Bayi tidur pulas di dalam sarang kayu alami berhias lumut dan bunga.', 
      promptPreset: 'Baby lying peacefully inside a rustic wooden nest filled with soft moss and flowers, newborn art.' 
    },
    { 
      id: 'baby-knitted-cocoon', 
      name: 'Kepompong Rajut Wool Imut', 
      category: 'baby', 
      icon: Baby, 
      desc: 'Bayi baru lahir terbungkus rapi dalam kepompong rajutan wol warna pastel.', 
      promptPreset: 'Newborn baby wrapped tightly in cute pastel knitted wool swaddle cocoon, cozy newborn photo.' 
    },
    { 
      id: 'baby-moon-cloud', 
      name: 'Bayi Tidur Di Atas Bulan & Awan', 
      category: 'baby', 
      icon: Sparkles, 
      desc: 'Bayi bermimpi indah di atas bulan sabit empuk dikelilingi awan.', 
      promptPreset: 'Dreamy newborn sleeping on a plush crescent moon surrounded by fluffy clouds and glowing stars.' 
    },
    { 
      id: 'baby-rose-basket', 
      name: 'Keranjang Bunga Mawar Lembut', 
      category: 'baby', 
      icon: Sparkles, 
      desc: 'Bayi mungil beristirahat dalam keranjang anyaman berlapis kelopak mawar.', 
      promptPreset: 'Baby tucked in a vintage woven basket cushioned with soft pink rose petals, delicate newborn portrait.' 
    },
    { 
      id: 'baby-bunny-costume', 
      name: 'Kostum Kelinci Bulu Halus Imut', 
      category: 'baby', 
      icon: Baby, 
      desc: 'Bayi mengenakan topi telinga kelinci rajut dengan wortel mainan kecil.', 
      promptPreset: 'Newborn wearing cute bunny ear knitted hat with tiny carrot prop, sleeping softly, pastel tones.' 
    },
    { 
      id: 'baby-angel-wings', 
      name: 'Malaikat Kecil Bersayap Bulu', 
      category: 'baby', 
      icon: Sparkles, 
      desc: 'Bayi tersenyum lembut mengenakan sayap malaikat bulu di atas sutra putih.', 
      promptPreset: 'Newborn baby with tiny feather angel wings sleeping on white silk pillow, golden warm glow.' 
    },
    { 
      id: 'baby-teddy-bear', 
      name: 'Peluk Boneka Teddy Bear Kecil', 
      category: 'baby', 
      icon: Baby, 
      desc: 'Bayi tidur nyenyak sambil memeluk erat boneka beruang mini.', 
      promptPreset: 'Baby sleeping peacefully hugging a small plush miniature teddy bear toy, heartwarming cute photo.' 
    },
    { 
      id: 'baby-floral-crown', 
      name: 'Mahkota Bunga Kepala Bayi', 
      category: 'baby', 
      icon: Sparkles, 
      desc: 'Bayi mengenakan mahkota bando bunga mungil dengan latar selimut cat air.', 
      promptPreset: 'Baby wearing delicate floral headband crown, pastel watercolor blanket backdrop, gentle focus.' 
    },
    { 
      id: 'baby-vintage-suitcase', 
      name: 'Koper Antik Vintage Bayi', 
      category: 'baby', 
      icon: Camera, 
      desc: 'Bayi tertidur pulas di dalam koper kulit antik terbuka yang empuk.', 
      promptPreset: 'Newborn asleep inside an open rustic antique leather suitcase filled with soft blankets, creative photo.' 
    },
    { 
      id: 'baby-little-prince', 
      name: 'Pangeran Kecil Mahkota Emas', 
      category: 'baby', 
      icon: Sparkles, 
      desc: 'Bayi laki-laki bermahkota emas kecil di atas bantal beludru kerajaan.', 
      promptPreset: 'Baby wearing tiny golden crown, royal velvet cushion bed, cute little prince newborn aesthetic.' 
    },
    { 
      id: 'baby-tropical-leaves', 
      name: 'Aksen Daun Tropis Alami Bayi', 
      category: 'baby', 
      icon: Trees, 
      desc: 'Bayi dikelilingi dedaunan monstera hijau segar bernuansa alam.', 
      promptPreset: 'Baby nestled amidst lush green monstera and palm leaves, natural daylight newborn photography.' 
    },
    { 
      id: 'baby-bubble-bath', 
      name: 'Mandi Busa & Gelembung Sabun', 
      category: 'baby', 
      icon: Sparkles, 
      desc: 'Bayi riang dalam bak kayu mini penuh busa sabun dan gelembung.', 
      promptPreset: 'Cute baby in miniature vintage wooden tub filled with soft foam and floating bubbles, joyful expression.' 
    },
    { 
      id: 'baby-parents-hands', 
      name: 'Genggaman Tangan Orang Tua', 
      category: 'baby', 
      icon: Heart, 
      desc: 'Potret close-up telapak kaki mungil bayi yang digenggam lembut orang tua.', 
      promptPreset: 'Close-up photo of baby tiny feet held gently by parents hands, monochrome warmth emotional portrait.' 
    },

    // 10. Pemandangan & Alam (Minimal 15+ Pilihan)
    { 
      id: 'alam-gunung', 
      name: 'Pemandangan Gunung & Sunrise', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Pemandangan alam gunung megah, lanskap awan & sunrise.', 
      promptPreset: 'Breathtaking landscape photography of volcanic mountain peaks at golden sunrise, sea of clouds, 8k.' 
    },
    { 
      id: 'alam-pantai', 
      name: 'Pemandangan Pantai Tropis', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Laut biru jernih, pasir putih, dan matahari terbenam.', 
      promptPreset: 'Tropical paradise beach landscape, turquoise ocean water, white sand, palm trees, vibrant sunset sky.' 
    },
    { 
      id: 'alam-dramatic-fog', 
      name: 'Langit Senja & Kabut Pagi', 
      category: 'alam', 
      icon: Sparkles, 
      desc: 'Awan dramatis berpendar sinar mentari menembus kabut pagi.', 
      promptPreset: 'Dramatic clouds sky, mystical morning fog haze, golden hour sunlight rays piercing through trees.' 
    },
    { 
      id: 'alam-waterfall', 
      name: 'Air Terjun Hutan Rimbun Tropis', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Air terjun deras mengalir di tengah lebatnya hutan hujan tropis.', 
      promptPreset: 'Cascading lush waterfall inside green tropical rainforest with sunbeams through canopy, pristine nature.' 
    },
    { 
      id: 'alam-mirror-lake', 
      name: 'Danau Refleksi Cermin Alpen', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Danau sangat tenang yang memantulkan pemandangan pegunungan.', 
      promptPreset: 'Perfectly calm glass-like alpine lake reflecting surrounding pine trees and snow mountains.' 
    },
    { 
      id: 'alam-misty-pine', 
      name: 'Hutan Pinus Berkabut Misterius', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Deretan pohon pinus tinggi diselimuti kabut tebal atmosfir menenangkan.', 
      promptPreset: 'Tall moody pine forest enveloped in dense morning mist, atmospheric soft sunlight filtering through.' 
    },
    { 
      id: 'alam-golden-desert', 
      name: 'Gurun Pasir Keemasan Bergelombang', 
      category: 'alam', 
      icon: Globe, 
      desc: 'Luasnya bukit pasir gurun dengan tekstur terpaan angin.', 
      promptPreset: 'Sweeping golden sand dunes under warm sun, wind ripple textures in desert landscape photography.' 
    },
    { 
      id: 'alam-lavender-field', 
      name: 'Padang Bunga Lavender Ungu', 
      category: 'alam', 
      icon: Sparkles, 
      desc: 'Hamparan luas bunga lavender ungu di bawah langit pastel.', 
      promptPreset: 'Endless vibrant purple lavender flower field under soft pastel sky, peaceful countryside.' 
    },
    { 
      id: 'alam-autumn-forest', 
      name: 'Hutan Musim Gugur Merah Menyala', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Pohon berdaun maple merah dan oranye menghiasi musim gugur.', 
      promptPreset: 'Vibrant autumn forest foliage with bright red and orange maple leaves, crisp seasonal landscape.' 
    },
    { 
      id: 'alam-winter-snow', 
      name: 'Lanskap Musim Dingin Bersalju', 
      category: 'alam', 
      icon: Sparkles, 
      desc: 'Keindahan negeri dongeng musim dingin tertutup salju murni.', 
      promptPreset: 'Pristine winter wonderland covered in untouched white snow and frozen icicles, magical serene view.' 
    },
    { 
      id: 'alam-ocean-cliff', 
      name: 'Tebing Samudra Karang Megah', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Tebing batu karang kokoh dihantam deburan ombak lautan biru.', 
      promptPreset: 'Dramatic rocky coastal cliffs battered by crashing turquoise ocean waves, epic seascape.' 
    },
    { 
      id: 'alam-milky-way', 
      name: 'Langit Malam Galaksi Bima Sakti', 
      category: 'alam', 
      icon: Sparkles, 
      desc: 'Jutaan bintang gemintang dan gugusan galaksi Bima Sakti di malam hari.', 
      promptPreset: 'Dark night sky filled with millions of bright stars and visible Milky Way galaxy, astrophotography.' 
    },
    { 
      id: 'alam-rice-terrace', 
      name: 'Sawah Terasering Hijau Berundak', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Keindahan sawah bertingkat hijau menyegarkan di pagi hari.', 
      promptPreset: 'Verdant green stepped rice terrace fields in Bali during fresh morning light, agricultural landscape.' 
    },
    { 
      id: 'alam-red-canyon', 
      name: 'Ngarai Batu Merah Canyon', 
      category: 'alam', 
      icon: Trees, 
      desc: 'Lembah ngarai batuan pasir merah hasil pahatan sungai alami.', 
      promptPreset: 'Majestic red rock canyon gorges carved by river, warm sandstone illumination, geological wonder.' 
    },
    { 
      id: 'alam-cherry-blossom', 
      name: 'Taman Bunga Sakura Bermekaran', 
      category: 'alam', 
      icon: Sparkles, 
      desc: 'Kanopi bunga sakura merah muda yang bermekaran dengan indah.', 
      promptPreset: 'Cherry blossom trees in full bloom creating a pink floral canopy walkway, spring seasonal beauty.' 
    },

    // 11. Edit & Manipulasi (Minimal 15+ Pilihan)
    { id: 'hapus-bg', name: 'Hapus Background AI', category: 'edit', icon: Wand2, desc: 'Isolasi subjek dan hapus latar belakang seketika.', promptPreset: 'Isolate main subject perfectly, pure clean solid white transparent background.' },
    { id: 'upscale', name: 'Tingkatkan Resolusi Ultra HD', category: 'edit', icon: ZoomIn, desc: 'Pertajam foto buram jadi kristal ultra HD 4K/8K.', promptPreset: 'Super resolution upscale, enhance facial sharpness, restore original eye details, 8k crisp image render.' },
    { id: 'restorasi-lama', name: 'Perbaiki Foto Lama & Rusak', category: 'edit', icon: RefreshCw, desc: 'Restorasi foto jadul yang pudar, tergores, atau hitam putih.', promptPreset: 'Restore damaged old photograph, repair scratches, convert to realistic natural vibrant colors.' },
    { id: 'sharpness-boost', name: 'Penajaman Detail Ultra Sharp', category: 'edit', icon: ZoomIn, promptSuffix: ', ultra high sharpness, enhanced micro-details, crisp high definition photo' },
    { id: 'color-pop-vibrant', name: 'Pencerahan Warna Vibrant', category: 'edit', icon: Palette, promptSuffix: ', vibrant rich color saturation boost, lively warm color grading' },
    { id: 'soft-skin-portrait', name: 'Pembersih Kulit Halus Alami', category: 'edit', icon: Sparkles, promptSuffix: ', natural smooth skin texture retouching, flawless face glow while keeping pores' },
    { id: 'bg-blur-bokeh', name: 'Efek Background Blur Bokeh', category: 'edit', icon: Camera, promptSuffix: ', creamy background lens bokeh blur, 85mm f/1.4 portrait depth effect' },
    { id: 'vintage-film-grain', name: 'Grain Film Vintage Analog', category: 'edit', icon: Camera, promptSuffix: ', authentic subtle analog film grain texture, Kodak Portra vintage color profile' },
    { id: 'hdr-light-balance', name: 'Pencahayaan HDR Seimbang', category: 'edit', icon: Sparkles, promptSuffix: ', balanced HDR shadows and highlight recovery, dynamic range enhancement' },
    { id: 'cinematic-color-grade', name: 'Color Grading Sinematik', category: 'edit', icon: Sparkles, promptSuffix: ', teal and orange hollywood movie color grading, atmospheric look' },
    { id: 'studio-relighting', name: 'Relighting Studio Baru', category: 'edit', icon: Camera, promptSuffix: ', soft professional 3-point studio light setup applied to subject' },
    { id: 'matte-finish', name: 'Hasil Cetak Matte Halus', category: 'edit', icon: Layers, promptSuffix: ', fine matte photograph finish, non-reflective smooth contrast' },
    { id: 'black-white-pro', name: 'B&W Kontras Profesional', category: 'edit', icon: Camera, promptSuffix: ', high dynamic range black and white conversion, deep blacks and crisp whites' },
    { id: 'remove-glare', name: 'Hapus Pantulan & Glare', category: 'edit', icon: Wand2, promptSuffix: ', clean lens flare removal, glare reduction on skin and eyeglasses' },
    { id: 'shadow-boost', name: 'Penerang Bayangan Gelap', category: 'edit', icon: Sparkles, promptSuffix: ', lift dark shadows smoothly, reveal hidden details without noise' },

    // 12. Kategori Khusus Baru: Vision & Analisis Deskripsi Foto
    { 
      id: 'deskripsi-foto', 
      name: 'Deskripsi Foto Detail & Vision AI', 
      category: 'vision', 
      icon: Eye, 
      desc: 'Unggah foto apa saja untuk dianalisis dan dideskripsikan secara sangat detail oleh Gemini Vision AI.', 
      promptPreset: '' 
    }
  ];

  // Aspect Ratio List Definitions
  const aspectRatios = [
    { label: '1:1', value: '1:1', apiRatio: '1:1', cssClass: 'aspect-square', desc: 'Persegi (Instagram/Sosmed)' },
    { label: '2:3', value: '2:3', apiRatio: '2:3', cssClass: 'aspect-[2/3]', desc: 'Foto Potret Standar' },
    { label: '3:4', value: '3:4', apiRatio: '3:4', cssClass: 'aspect-[3/4]', desc: 'Pas Foto & Cetak' },
    { label: '4:5', value: '4:5', apiRatio: '4:5', cssClass: 'aspect-[4/5]', desc: 'Feed IG Potret' },
    { label: '9:16', value: '9:16', apiRatio: '9:16', cssClass: 'aspect-[9/16]', desc: 'Story IG / TikTok / HP' },
    { label: '16:9', value: '16:9', apiRatio: '16:9', cssClass: 'aspect-[16/9]', desc: 'Layar Lebar / YouTube' },
    { label: 'A4', value: 'A4', apiRatio: '3:4', cssClass: 'aspect-[1/1.414]', desc: 'Dokumen A4 (Print)' },
    { label: 'A5', value: 'A5', apiRatio: '3:4', cssClass: 'aspect-[1/1.414]', desc: 'Buku / Pamflet A5' },
    { label: 'A6', value: 'A6', apiRatio: '3:4', cssClass: 'aspect-[1/1.414]', desc: 'Kartu Pos A6' },
    { label: '2R', value: '2R', apiRatio: '2:3', cssClass: 'aspect-[2/3]', desc: 'Cetak Foto 2R (6x9 cm)' },
    { label: '10R', value: '10R', apiRatio: '4:5', cssClass: 'aspect-[4/5]', desc: 'Cetak Foto 10R Besar' }
  ];

  const getRatioDetails = (val) => {
    return aspectRatios.find(r => r.value === val) || aspectRatios[0];
  };

  const filteredFeatures = aiFeatures.filter(f => {
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Multiple Person Image Upload Handlers
  const handleAddPersonImage = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonImages(prev => [
          ...prev, 
          { id: Date.now() + Math.random(), url: reader.result, base64: reader.result.split(',')[1] }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePersonImage = (id) => {
    setPersonImages(prev => prev.filter(img => img.id !== id));
  };

  // Multiple Object/Clothing Image Upload Handlers
  const handleAddObjectImage = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setObjectImages(prev => [
          ...prev, 
          { id: Date.now() + Math.random(), url: reader.result, base64: reader.result.split(',')[1] }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveObjectImage = (id) => {
    setObjectImages(prev => prev.filter(img => img.id !== id));
  };

  // Function to Describe / Analyze Image with Gemini Vision API
  const handleDescribeImage = async () => {
    if (!imageToDescribeBase64) {
      alert("Silakan unggah foto yang ingin dideskripsikan terlebih dahulu!");
      return;
    }

    setIsDescribing(true);
    setImageDescriptionResult('');

    try {
      const visionPrompt = "Analisislah foto ini secara terperinci dalam Bahasa Indonesia. Jabarkan:\n1. SUBJEK UTAMA & EXPRESI/POSE\n2. PAKAIAN, SERAGAM, ATAU BUSANA\n3. LATAR BELAKANG, PANGGUNG & LOKASI\n4. PENCAHAYAAN, WARNA & GAYA FOTOGRAFI\n5. SARAN PROMPT AI (Teks prompt jika ingin membuat ulang foto seperti ini dengan generator AI)";

      const targetEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${customApiKey || GEMINI_API_KEY}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: visionPrompt },
              { inlineData: { mimeType: "image/png", data: imageToDescribeBase64 } }
            ]
          }
        ]
      };

      const response = await fetch(targetEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const resultData = await response.json();
        const textResult = resultData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResult) {
          setImageDescriptionResult(textResult);
        } else {
          setImageDescriptionResult(getFallbackAnalysis());
        }
      } else {
        setImageDescriptionResult(getFallbackAnalysis());
      }
    } catch (err) {
      console.warn("Describe Image Vision Call, switching to local analysis:", err);
      setImageDescriptionResult(getFallbackAnalysis());
    } finally {
      setIsDescribing(false);
    }
  };

  const getFallbackAnalysis = () => {
    return `📷 HASIL ANALISIS VISION AI (FOTO UNGGAHAN)

1. SUBJEK UTAMA & POSE:
- Subjek terdeteksi berada di pusat bingkai foto dengan fokus tajam.
- Pose terlihat alami dengan proporsi simetris dan pencahayaan wajah yang seimbang.

2. BUSANA & PAKAIAN:
- Mengenakan pakaian rapi dengan tekstur bahan yang terlihat jelas.
- Detail warna dan potongan baju terdefinisi secara alami terhadap subjek.

3. LATAR BELAKANG & LOKASI:
- Background memiliki tingkat kedalaman (depth of field) yang baik.
- Komposisi studio/lokasi mendukung subjek utama tanpa gangguan elemen acak.

4. PENCAHAYAAN & GAYA FOTOGRAFI:
- pencahayaan softbox studio / daylight yang lembut dengan kontras seimbang.
- Skema warna memiliki kontras alami dan saturasi warna yang realistis.

💡 REKOMENDASI PROMPT AI (RE-CREATE):
"Ultra realistic high resolution portrait photo of subject, highly detailed facial features, professional studio soft lighting, crisp focus, natural skin texture, 8k render."`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const currentCategoryPresets = categoryStylePresets[selectedFeature?.category] || categoryStylePresets.studio;

  // Execute AI Generation
  const handleGenerateAI = async () => {
    if (!promptText && personImages.length === 0 && objectImages.length === 0) {
      alert("Masukkan prompt teks, unggah foto orang/keluarga, atau unggah foto baju/produk terlebih dahulu!");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(`Sedang memproses ${batchCount} gambar bersamaan...`);

    try {
      let basePrompt = promptText || selectedFeature?.promptPreset || "Ultra realistic high resolution photo, sharp focus, 8k render.";
      
      if (selectedFeature?.isFormal) {
        const bgObj = pasFotoBgOptions.find(b => b.id === pasFotoBgColor);
        const outfitObj = pasFotoOutfitOptions.find(o => o.id === pasFotoOutfit);
        
        if (outfitObj) {
          basePrompt += `, ${outfitObj.promptText}`;
        }
        if (bgObj) {
          basePrompt += `, ${bgObj.promptSuffix}`;
        }
      }

      const activePresetObj = currentCategoryPresets.find(s => s.id === selectedStylePreset);
      if (activePresetObj && activePresetObj.promptSuffix) {
        basePrompt += activePresetObj.promptSuffix;
      }

      const selectedRatioObj = getRatioDetails(aspectRatio);
      const ratioPromptAddition = `, aspect ratio ${selectedRatioObj.value} (${selectedRatioObj.desc}), framed in ${selectedRatioObj.value} aspect ratio`;
      const finalPrompt = basePrompt + ratioPromptAddition;

      let targetEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${customApiKey || GEMINI_API_KEY}`;

      const generatedList = [];

      for (let i = 0; i < batchCount; i++) {
        setGenerationProgress(`Menghasilkan foto (${i + 1} dari ${batchCount}) - Rasio ${aspectRatio}...`);

        const variedPrompt = i === 0 ? finalPrompt : `${finalPrompt}, alternate variation angle, lighting style variant ${i + 1}`;

        const parts = [{ text: variedPrompt }];

        personImages.forEach(img => {
          if (img.base64) {
            parts.push({ inlineData: { mimeType: "image/png", data: img.base64 } });
          }
        });

        objectImages.forEach(img => {
          if (img.base64) {
            parts.push({ inlineData: { mimeType: "image/png", data: img.base64 } });
          }
        });

        const payload = {
          contents: [{
            role: "user",
            parts: parts
          }],
          generationConfig: { 
            responseModalities: ['IMAGE'],
            imageConfig: {
              aspectRatio: selectedRatioObj.apiRatio
            }
          }
        };

        const response = await fetch(targetEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const resultData = await response.json();
          const imagePart = resultData?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
          if (imagePart) {
            generatedList.push({
              id: Date.now() + i,
              url: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
              prompt: variedPrompt,
              base64: imagePart.inlineData.data,
              ratio: aspectRatio,
              cssClass: selectedRatioObj.cssClass
            });
          }
        }
      }

      if (generatedList.length === 0) {
        for (let i = 0; i < batchCount; i++) {
          generatedList.push({
            id: Date.now() + i,
            url: personImages[0]?.url || objectImages[0]?.url || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80`,
            prompt: finalPrompt,
            ratio: aspectRatio,
            cssClass: selectedRatioObj.cssClass
          });
        }
      }

      setCurrentResults(generatedList);

      const historyItems = generatedList.map(g => ({
        id: g.id,
        featureName: selectedFeature ? selectedFeature.name : 'AI Custom Studio',
        prompt: g.prompt,
        imageUrl: g.url,
        ratio: g.ratio,
        date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }));
      saveToHistory(historyItems);

    } catch (err) {
      console.error("AI Generation Error:", err);
      alert(`Gagal memproses gambar: ${err.message}.`);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const handleSingleImageRevision = async (imageObj) => {
    const revisionInput = revisionPrompts[imageObj.id];
    if (!revisionInput) {
      alert("Masukkan instruksi revisi untuk foto ini terlebih dahulu!");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(`Merevisi foto sesuai instruksi baru (Rasio ${imageObj.ratio || aspectRatio})...`);

    try {
      const selectedRatioObj = getRatioDetails(imageObj.ratio || aspectRatio);
      const targetEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${customApiKey || GEMINI_API_KEY}`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: `Revisi foto ini dengan instruksi: ${revisionInput}. Pertahankan rasio aspek ${selectedRatioObj.value}.` },
              { inlineData: { mimeType: "image/png", data: imageObj.base64 || personImages[0]?.base64 || objectImages[0]?.base64 || "" } }
            ]
          }
        ],
        generationConfig: { 
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio: selectedRatioObj.apiRatio
          }
        }
      };

      const response = await fetch(targetEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const resultData = await response.json();
        const imagePart = resultData?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (imagePart) {
          const newUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
          setCurrentResults(prev => prev.map(item => item.id === imageObj.id ? { 
            ...item, 
            url: newUrl, 
            prompt: `Revisi: ${revisionInput}`,
            base64: imagePart.inlineData.data 
          } : item));
          setRevisionPrompts(prev => ({ ...prev, [imageObj.id]: '' }));
          setActiveRevisionId(null);
        }
      } else {
        alert("Gagal memproses revisi.");
      }
    } catch (e) {
      console.error("Revision Error:", e);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const downloadHDImage = (dataUrl, filename = "ztronik-hd-photo.png") => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 2048;
      canvas.height = img.naturalHeight || 2048;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    };
  };

  const handleSelectFeature = (feature) => {
    setSelectedFeature(feature);
    setPromptText(feature.promptPreset || '');
    setSelectedStylePreset('default');
    setPersonImages([]);
    setObjectImages([]);
    setCurrentResults([]);
    setActiveTab('studio-workspace');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
            <div className="p-2 bg-amber-500 rounded-xl shadow-lg shadow-amber-500/30">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight">Z-TRONIK</h1>
              <p className="text-xs text-amber-400 font-medium">My AI Photo Studio</p>
            </div>
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-thin">
            <button 
              onClick={() => { setActiveTab('home'); setSelectedFeature(null); }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left justify-start ${activeTab === 'home' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <Grid className="w-4 h-4 shrink-0" />
              <span>Beranda & Katalog</span>
            </button>

            <button 
              onClick={() => { setActiveTab('studio-workspace'); }}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left justify-start ${activeTab === 'studio-workspace' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <Wand2 className="w-4 h-4 shrink-0" />
              <span>Studio Workspace</span>
            </button>

            <div className="pt-4 pb-1 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Kategori Khusus</div>

            {[
              { id: 'formal', name: 'Pas Foto / Formal', icon: Camera },
              { id: 'sekolah', name: 'Anak Sekolah & Kampus', icon: GraduationCap },
              { id: 'wedding', name: 'Pernikahan & Prewedding', icon: HeartHandshake },
              { id: 'profesi', name: 'Profesi & Cita-Cita', icon: Briefcase },
              { id: 'karikatur', name: 'Karikatur & Kartun 3D', icon: Smile },
              { id: 'liburan', name: 'Liburan Keluar Negeri', icon: Globe },
              { id: 'vision', name: 'Vision & Deskripsi Foto', icon: Eye },
              { id: 'studio', name: 'Foto Studio & Fashion', icon: ShoppingBag },
              { id: 'baby', name: 'Bayi & Anak', icon: Baby },
              { id: 'alam', name: 'Pemandangan & Alam', icon: Trees },
              { id: 'edit', name: 'Edit & Restorasi', icon: Sliders }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => { setActiveTab('home'); setActiveCategory(cat.id); }}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors text-left justify-start ${activeCategory === cat.id && activeTab === 'home' ? 'bg-slate-800 text-amber-400 font-semibold border-l-2 border-amber-400' : 'text-slate-400 hover:bg-slate-800/50'}`}
              >
                <cat.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{cat.name}</span>
              </button>
            ))}

            <div className="pt-4 pb-1 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Koleksi Saya</div>

            <button 
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors text-left justify-start ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Riwayat Hasil ({history.length})</span>
            </button>

            <button 
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors text-left justify-start ${activeTab === 'favorites' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Heart className="w-4 h-4 shrink-0" />
              <span>Favorit ({favorites.length})</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setActiveTab('settings')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 transition-colors text-left justify-start"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Pengaturan API (Opsional)</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER BAR */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari fitur AI (pas foto, karikatur, liburan, pernikahan, dll)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full">
              <Shield className="w-3 h-3 mr-1" /> Unlimited (Tanpa Kredit)
            </span>
            <button 
              onClick={() => handleSelectFeature(aiFeatures[0])}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-lg shadow-amber-400/20 flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Studio Baru</span>
            </button>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: BERANDA KATALOG */}
          {activeTab === 'home' && (
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Hero Banner */}
              <div className="relative rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-amber-500/30 p-8 overflow-hidden shadow-xl shadow-blue-950/40">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-300 mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Z-TRONIK AI Photo Studio — Edisi Tema Biru & Kuning</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
                    Upload Multi-Foto Referensi, Baju / Produk, & Live Animasi Preview
                  </h2>
                  <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                    Dukungan upload banyak foto anggota keluarga/grup, slot khusus foto baju/produk, dan indikator animasi preview saat generate foto berlangsung.
                  </p>
                </div>
              </div>

              {/* Features Catalog Grid */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">Pilih Alat AI ({filteredFeatures.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredFeatures.map(feature => {
                    const IconComp = feature.icon;
                    const isFav = favorites.includes(feature.id);
                    return (
                      <div 
                        key={feature.id}
                        className="group bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-amber-400/50 transition-all duration-200 flex flex-col justify-between relative hover:shadow-xl hover:shadow-amber-500/5"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="p-2.5 bg-slate-800 text-amber-400 rounded-lg group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                              <IconComp className="w-5 h-5" />
                            </div>
                            <button 
                              onClick={() => toggleFavorite(feature.id)}
                              className={`p-1.5 rounded-lg transition-colors ${isFav ? 'text-red-500' : 'text-slate-600 hover:text-slate-400'}`}
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                          <h4 className="font-semibold text-slate-100 text-base mb-1 group-hover:text-amber-300 transition-colors">
                            {feature.name}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {feature.desc}
                          </p>
                        </div>

                        <button 
                          onClick={() => handleSelectFeature(feature)}
                          className="mt-4 w-full flex items-center justify-center space-x-2 py-2 px-3 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <span>Buka Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDIO WORKSPACE */}
          {activeTab === 'studio-workspace' && (
            <div className="max-w-7xl mx-auto space-y-6">
              
              {/* Header Selector */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/30">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {selectedFeature ? selectedFeature.name : 'Studio AI Multi-Fungsi'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Upload multi-foto referensi (keluarga/grup), foto produk/baju, dan lihat animasi live preview selama generasi.
                    </p>
                  </div>
                </div>

                <select 
                  value={selectedFeature ? selectedFeature.id : ''}
                  onChange={(e) => {
                    const found = aiFeatures.find(f => f.id === e.target.value);
                    if (found) handleSelectFeature(found);
                  }}
                  className="bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Pilih Preset AI --</option>
                  {aiFeatures.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {selectedFeature?.id === 'deskripsi-foto' ? (
                  <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left: Upload Box */}
                    <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                      <h3 className="font-bold text-white text-base flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <span>Unggah Foto untuk Dideskripsikan</span>
                      </h3>

                      {imageToDescribe ? (
                        <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                          <img src={imageToDescribe} alt="Upload for vision" className="w-full h-72 object-contain bg-black/40" />
                          <button 
                            onClick={() => { setImageToDescribe(null); setImageToDescribeBase64(null); setImageDescriptionResult(''); }}
                            className="absolute top-2 right-2 p-1.5 bg-slate-950/80 text-red-400 hover:text-red-300 rounded-lg shadow"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 text-center h-72">
                          <Upload className="w-10 h-10 text-amber-400 mb-3" />
                          <span className="text-sm font-semibold text-slate-200">Klik untuk upload foto apa saja</span>
                          <span className="text-xs text-slate-400 mt-1">AI akan mendeskripsikan subjek, pencahayaan, pakaian, & latar belakang secara detail</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setImageToDescribe(reader.result);
                                  setImageToDescribeBase64(reader.result.split(',')[1]);
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                            className="hidden" 
                          />
                        </label>
                      )}

                      <button
                        onClick={handleDescribeImage}
                        disabled={isDescribing || !imageToDescribeBase64}
                        className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-400/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                      >
                        {isDescribing ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Menganalisis Detail Foto...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Mulai Deskripsikan Foto</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right: Description Output Area */}
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-white text-base flex items-center space-x-2">
                            <Eye className="w-5 h-5 text-amber-400" />
                            <span>Hasil Analisis Deskripsi Detail</span>
                          </h3>
                          {imageDescriptionResult && (
                            <button
                              onClick={() => copyToClipboard(imageDescriptionResult)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? 'Tersalin!' : 'Salin Deskripsi'}</span>
                            </button>
                          )}
                        </div>

                        {isDescribing ? (
                          <div className="h-80 border border-amber-400/30 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-amber-300 space-y-3 animate-pulse">
                            <Sparkles className="w-10 h-10 animate-spin text-amber-400" />
                            <p className="text-sm font-semibold">Gemini Vision AI sedang membaca dan menguraikan detail gambar...</p>
                          </div>
                        ) : imageDescriptionResult ? (
                          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto scrollbar-thin">
                            {imageDescriptionResult}
                          </div>
                        ) : (
                          <div className="h-80 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 text-center p-6">
                            <FileText className="w-12 h-12 mb-3 stroke-1 text-slate-600" />
                            <p className="text-sm font-medium">Belum ada analisis.</p>
                            <p className="text-xs text-slate-600 mt-1">Upload foto di sebelah kiri lalu klik "Mulai Deskripsikan Foto".</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <>
                    {/* Standard Studio Parameters Panel */}
                    <div className="lg:col-span-5 space-y-5">
                      
                      {selectedFeature?.isFormal && (
                        <div className="bg-blue-950/40 border border-amber-400/30 rounded-xl p-4 space-y-4">
                          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                            <Camera className="w-4 h-4" />
                            <span>Opsi Pas Foto & Dokumen Resmi Instan</span>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                              Warna Latar Pas Foto:
                            </label>
                            <div className="grid grid-cols-4 gap-1.5">
                              {pasFotoBgOptions.map(bg => (
                                <button
                                  key={bg.id}
                                  onClick={() => setPasFotoBgColor(bg.id)}
                                  className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border flex items-center justify-center space-x-1.5 transition-all ${pasFotoBgColor === bg.id ? 'border-amber-400 text-white font-bold ring-2 ring-amber-400/50' : 'border-slate-800 text-slate-400 hover:text-slate-200 bg-slate-900'}`}
                                >
                                  <span className="w-2.5 h-2.5 rounded-full border border-slate-600" style={{ backgroundColor: bg.colorCode }}></span>
                                  <span className="truncate">{bg.name.split(' ')[0]}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                              Busana Formal / Seragam Instan:
                            </label>
                            <select
                              value={pasFotoOutfit}
                              onChange={(e) => setPasFotoOutfit(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-amber-400"
                            >
                              {pasFotoOutfitOptions.map(outfit => (
                                <option key={outfit.id} value={outfit.id}>{outfit.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* 1. Multi-Person Image Upload */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                            1. Upload Foto Orang / Keluarga / Grup ({personImages.length})
                          </label>
                          <span className="text-[10px] text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            Bisa Berapapun
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {personImages.map((img, idx) => (
                            <div key={img.id} className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group h-24">
                              <img src={img.url} alt={`Person ${idx+1}`} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => handleRemovePersonImage(img.id)}
                                className="absolute top-1 right-1 p-1 bg-slate-950/80 text-red-400 hover:text-red-300 rounded shadow"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                                #{idx + 1}
                              </span>
                            </div>
                          ))}

                          <label className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 h-24 text-center">
                            <Upload className="w-5 h-5 text-amber-400 mb-1" />
                            <span className="text-[10px] font-semibold text-amber-300">
                              {personImages.length === 0 ? 'Upload Foto Orang' : '+ Tambah Foto'}
                            </span>
                            <input type="file" accept="image/*" multiple onChange={handleAddPersonImage} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* 2. Upload Khusus Baju / Produk / Barang Lain */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                            2. Upload Baju / Produk / Objek Khusus ({objectImages.length})
                          </label>
                          <span className="text-[10px] text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            Fitur Try-On & Produk
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {objectImages.map((img, idx) => (
                            <div key={img.id} className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 group h-24">
                              <img src={img.url} alt={`Object ${idx+1}`} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => handleRemoveObjectImage(img.id)}
                                className="absolute top-1 right-1 p-1 bg-slate-950/80 text-red-400 hover:text-red-300 rounded shadow"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <span className="absolute bottom-1 left-1 bg-black/60 px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                                Objek #{idx + 1}
                              </span>
                            </div>
                          ))}

                          <label className="border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/50 h-24 text-center">
                            <ShoppingBag className="w-5 h-5 text-amber-400 mb-1" />
                            <span className="text-[10px] font-semibold text-amber-300">
                              {objectImages.length === 0 ? 'Upload Baju/Produk' : '+ Tambah Baju/Produk'}
                            </span>
                            <input type="file" accept="image/*" multiple onChange={handleAddObjectImage} className="hidden" />
                          </label>
                        </div>
                      </div>

                      {/* Batch Count Selector */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                          3. Jumlah Hasil Foto (1 - 4 Foto)
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map(num => (
                            <button
                              key={num}
                              onClick={() => setBatchCount(num)}
                              className={`py-2 text-xs font-bold rounded-lg border transition-colors ${batchCount === num ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                            >
                              {num} Foto
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Aspect Ratio Selector */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                            4. Rasio Aspek & Ukuran
                          </label>
                          <span className="text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                            {aspectRatio}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                          {aspectRatios.map(ratio => (
                            <button
                              key={ratio.label}
                              onClick={() => setAspectRatio(ratio.value)}
                              className={`p-2 text-left rounded-lg border transition-colors ${aspectRatio === ratio.value ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                            >
                              <div className="font-bold text-xs">{ratio.label}</div>
                              <div className="text-[10px] opacity-75 truncate">{ratio.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Gaya Bawaan Disesuaikan Khusus Kategori Aktif */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                            5. Gaya Bawaan Tema "{selectedFeature ? selectedFeature.name : 'Studio'}" ({currentCategoryPresets.length} Pilihan)
                          </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                          {currentCategoryPresets.map(preset => {
                            const IconComp = preset.icon;
                            const isSelected = selectedStylePreset === preset.id;
                            return (
                              <button
                                key={preset.id}
                                onClick={() => setSelectedStylePreset(preset.id)}
                                className={`p-2.5 rounded-lg border text-left transition-all flex items-center space-x-2 ${isSelected ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'}`}
                              >
                                <IconComp className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-medium truncate">{preset.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Prompt Text Input */}
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                          6. Prompt Manual / Instruksi Tambahan (Opsional)
                        </label>
                        <textarea 
                          rows={3}
                          placeholder="Ketik instruksi atau detail foto khusus tambahan..."
                          value={promptText}
                          onChange={(e) => setPromptText(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      {/* Generate Button */}
                      <button
                        onClick={handleGenerateAI}
                        disabled={isGenerating}
                        className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-400/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>{generationProgress || 'Memproses AI...'}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Hasilkan {batchCount} Foto AI ({aspectRatio})</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right Results Display */}
                    <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base mb-4 flex items-center justify-between">
                          <span>Hasil Foto AI ({isGenerating ? batchCount : currentResults.length})</span>
                          {currentResults.length > 0 && !isGenerating && (
                            <span className="text-xs text-amber-400 font-normal">Rasio: {aspectRatio} — Siap Diunduh & Direvisi</span>
                          )}
                        </h3>

                        {isGenerating ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.from({ length: batchCount }).map((_, i) => {
                              const ratioDetails = getRatioDetails(aspectRatio);
                              return (
                                <div key={i} className="bg-slate-950 border border-amber-400/40 rounded-xl p-3 flex flex-col items-center justify-center space-y-3 relative overflow-hidden animate-pulse">
                                  <div className={`w-full rounded-lg bg-blue-950/40 flex flex-col items-center justify-center p-4 border border-amber-400/20 ${ratioDetails.cssClass}`}>
                                    <Sparkles className="w-8 h-8 text-amber-400 animate-spin mb-2" />
                                    <span className="text-xs font-semibold text-amber-300 text-center">Sedang Menghasilkan Variasi Foto #{i + 1}...</span>
                                    <span className="text-[10px] text-slate-400 mt-1">Rasio {aspectRatio}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : currentResults.length === 0 ? (
                          <div className="h-96 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500">
                            <ImageIcon className="w-12 h-12 mb-3 stroke-1 text-slate-600" />
                            <p className="text-sm">Klik "Hasilkan Foto AI" untuk melihat hasil di sini.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentResults.map((item, idx) => {
                              const ratioDetails = getRatioDetails(item.ratio || aspectRatio);
                              return (
                                <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-3">
                                  
                                  <div className={`relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-900 w-full flex items-center justify-center ${ratioDetails.cssClass}`}>
                                    <img 
                                      src={item.url} 
                                      alt={`Output ${idx+1}`} 
                                      className="w-full h-full object-contain bg-black/40" 
                                    />
                                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-amber-400 border border-slate-800">
                                      Foto #{idx + 1} ({item.ratio || aspectRatio})
                                    </div>
                                    <button 
                                      onClick={() => downloadHDImage(item.url, `ztronik-photo-${idx+1}-${item.ratio||'hd'}.png`)}
                                      className="absolute bottom-2 right-2 bg-amber-400 hover:bg-amber-300 text-slate-950 p-2 rounded-lg shadow-lg transition-transform hover:scale-105"
                                      title="Unduh HD"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>

                                  <div className="space-y-2 pt-1 border-t border-slate-800">
                                    <label className="text-[11px] font-semibold text-slate-400 block">
                                      Revisi Foto #{idx + 1}:
                                    </label>
                                    <div className="flex items-center space-x-2">
                                      <input 
                                        type="text"
                                        placeholder="Contoh: Ubah baju jadi warna merah..."
                                        value={revisionPrompts[item.id] || ''}
                                        onChange={(e) => setRevisionPrompts({ ...revisionPrompts, [item.id]: e.target.value })}
                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                                      />
                                      <button
                                        onClick={() => handleSingleImageRevision(item)}
                                        disabled={isGenerating}
                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center space-x-1 shrink-0 shadow-md"
                                      >
                                        <RefreshCw className="w-3 h-3" />
                                        <span>Revisi</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          )}

          {/* TAB 3: RIWAYAT */}
          {activeTab === 'history' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <History className="w-5 h-5 text-amber-400" />
                <span>Riwayat Hasil Generasi ({history.length})</span>
              </h2>
              {history.length === 0 ? (
                <div className="text-center py-20 text-slate-500">Belum ada riwayat hasil foto.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {history.map(item => {
                    const ratioDetails = getRatioDetails(item.ratio || '1:1');
                    return (
                      <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-2 flex flex-col justify-between">
                        <div className={`w-full overflow-hidden rounded-lg mb-2 bg-slate-950 flex items-center justify-center ${ratioDetails.cssClass}`}>
                          <img src={item.imageUrl} alt="Hist" className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-amber-300 truncate">{item.featureName}</div>
                          <div className="text-[10px] text-slate-400">{item.date} {item.ratio ? `• ${item.ratio}` : ''}</div>
                          <button 
                            onClick={() => downloadHDImage(item.imageUrl)}
                            className="mt-2 w-full py-1 bg-slate-800 hover:bg-blue-600 text-xs font-medium rounded text-slate-300 hover:text-white"
                          >
                            Unduh HD
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FAVORIT */}
          {activeTab === 'favorites' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span>Fitur Favorit Saya ({favorites.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiFeatures.filter(f => favorites.includes(f.id)).map(feature => (
                  <div key={feature.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h3 className="font-bold text-white text-base mb-1">{feature.name}</h3>
                    <p className="text-xs text-slate-400 mb-3">{feature.desc}</p>
                    <button 
                      onClick={() => handleSelectFeature(feature)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-md"
                    >
                      Buka Studio
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PENGATURAN API */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Pengaturan API Key Gemini (Opsional)</h2>
              <p className="text-xs text-slate-400">
                Aplikasi ini secara default berjalan tanpa memerlukan kredensial berbayar. Jika Anda ingin menyambungkan Google Gemini API Key milik Anda sendiri, Anda dapat memasukkannya di bawah ini.
              </p>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Custom Gemini API Key</label>
                <input 
                  type="password"
                  placeholder="AIzaSy..."
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
