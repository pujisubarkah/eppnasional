import { NextResponse } from "next/server";

export async function GET() {
  // Fetch review data from API
  let reviewData = null;
  try {
    const reviewRes = await fetch("https://eppnasional.lan.go.id/api/review");
    if (reviewRes.ok) {
      reviewData = await reviewRes.json();
    }
  } catch (e) {
    reviewData = null;
  }
  // Fetch waktu data from API
  let waktuData = null;
  try {
    const waktuRes = await fetch("https://eppnasional.lan.go.id/api/waktu");
    if (waktuRes.ok) {
      waktuData = await waktuRes.json();
    }
  } catch (e) {
    waktuData = null;
  }
  // Fetch sikap data from API
  let sikapData = null;
  try {
    const sikapRes = await fetch("https://eppnasional.lan.go.id/api/sikap");
    if (sikapRes.ok) {
      sikapData = await sikapRes.json();
    }
  } catch (e) {
    sikapData = null;
  }
  // Fetch dukungan data from API
  let dukunganData = null;
  try {
    const dukunganRes = await fetch("https://eppnasional.lan.go.id/api/dukungan");
    if (dukunganRes.ok) {
      dukunganData = await dukunganRes.json();
    }
  } catch (e) {
    dukunganData = null;
  }
  // Data dari /api/summarycard
  const summarycard = {
    totalResponden: 265,
    tahunPelatihan: { 2021: 61, 2022: 38, 2023: 37, 2024: 94 },
    totalInstansi: 48,
  };
  const today = new Date();
  const bulan = today.toLocaleString("id-ID", { month: "long" });
  const tahun = today.getFullYear();
  const tanggal = today.getDate();
  const tanggalStr = `${tanggal} ${bulan} ${tahun}`;

  const dataDummy = {
    cover: "Laporan Survey Evaluasi Pasca Pelatihan Nasional Tahun 2025",
  instansi: "Lembaga Administrasi Negara",
    tanggal: tanggalStr,
    executiveSummary: `Direktorat Penjaminan Mutu Pengembangan Kapasitas adalah bagian integral dari Lembaga Administrasi Negara (LAN) 
  yang mengemban tanggung jawab strategis dalam menjamin mutu pelatihan bagi Aparatur Sipil Negara (ASN). 
  Melalui pendekatan evaluatif, pemantauan sistematis, serta pengembangan yang berkesinambungan, direktorat ini 
  berkomitmen memastikan bahwa setiap program pelatihan tidak hanya berhenti pada transfer pengetahuan di ruang kelas, 
  tetapi benar-benar memberikan dampak yang signifikan terhadap peningkatan kinerja individu maupun organisasi.

  Sebagai wujud komitmen tersebut, kami menginisiasi Evaluasi Pasca Pelatihan (EPP) Nasional – sebuah upaya mendalam 
  untuk mendengarkan kembali suara para alumni pelatihan, menilai sejauh mana hasil pelatihan diimplementasikan 
  dalam lingkungan kerja, serta mengidentifikasi peluang peningkatan yang lebih baik ke depannya.

  Pada tahun 2025, EPP Nasional secara khusus menyasar alumni pelatihan yang mengikuti program LAN pada tahun 2021 hingga 2024. 
  Evaluasi ini mencakup berbagai aspek penting seperti perubahan kompetensi individu, penerapan hasil pelatihan di tempat kerja, 
  dukungan organisasi, serta dampak terhadap pencapaian kinerja unit kerja. Hasil dari evaluasi ini akan menjadi landasan 
  berharga dalam memperkuat siklus pembelajaran dan merancang pelatihan ASN yang lebih adaptif, relevan, dan berdampak.

  Laporan ini merangkum hasil evaluasi pelatihan nasional tahun 2025 yang diikuti oleh ${summarycard.totalResponden} responden dari ${summarycard.totalInstansi} instansi. 
  Pelatihan dilaksanakan pada tahun 2021-2024 dengan jumlah alumni bervariasi tiap tahun. 
  Mayoritas peserta menyatakan puas terhadap materi dan fasilitator, namun terdapat beberapa masukan terkait durasi pelatihan dan fasilitas pendukung. 
  Hasil survey ini diharapkan dapat menjadi acuan peningkatan kualitas pelatihan di masa mendatang.`,
  kataPengantar: `Puji syukur kami panjatkan kepada Tuhan Yang Maha Esa atas terselesaikannya laporan Evaluasi Pasca Pelatihan Nasional ini. 
Laporan ini disusun sebagai bagian dari upaya Direktorat Penjaminan Mutu Pengembangan Kapasitas - LAN dalam menilai 
implementasi hasil pelatihan ASN dan mengidentifikasi peluang perbaikan program pelatihan ke depan. 
Terima kasih kami sampaikan kepada seluruh pihak yang telah berkontribusi, baik peserta, fasilitator, maupun tim pengolahan data, 
sehingga laporan ini dapat terselesaikan dengan baik dan menjadi acuan strategis untuk pengembangan kapasitas ASN ke depannya.`,
  };

  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .cover { text-align: center; margin-top: 100px; }
          .cover h1 { font-size: 36px; color: #1976D2; }
          .cover p { font-size: 18px; margin-top: 10px; }
          h2 { color: #1565C0; margin-top: 40px; }
          p { line-height: 1.6; margin-top: 10px; text-align: justify; }
          table { border-collapse: collapse; margin-top: 16px; margin-left: auto; margin-right: auto; }
          th, td { border: 1px solid #1976D2; padding: 6px 12px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="cover">
          <img src="/lanri_.png" alt="Logo Instansi" style="width:120px; margin-bottom:20px;" />
          <h1>${dataDummy.cover}</h1>
          <p>Instansi: ${dataDummy.instansi}</p>
          <p>Tanggal: ${dataDummy.tanggal}</p>
      

        <div style="page-break-before: always;">
          <h2>Executive Summary</h2>
          <p>${dataDummy.executiveSummary}</p>
        
        <div style="page-break-before: always;">
          <h2>Kata Pengantar</h2>
          <p>${dataDummy.kataPengantar}</p>
        
        <div style="page-break-before: always;">
          <h2>Ringkasan Hasil Survey</h2>
          <p><b>Total Responden:</b> ${summarycard.totalResponden}</p>
          <p><b>Total Instansi:</b> ${summarycard.totalInstansi}</p>
          <table>
            <tr><th>Tahun Pelatihan</th><th>Jumlah Alumni</th></tr>
            ${Object.entries(summarycard.tahunPelatihan).map(([tahun, jumlah]) => `<tr><td>${tahun}</td><td>${jumlah}</td></tr>`).join("")}
          </table>
          <br />
          <h3>1. Dukungan Lingkungan</h3>
          <p>
            Berdasarkan analisis distribusi jawaban responden, mayoritas menunjukkan <b style="color:green;">sikap positif</b> terhadap dukungan lingkungan kerja setelah mengikuti pelatihan.<br>
            Dukungan lingkungan kerja yang positif meliputi <b style="color:blue;">respon positif terhadap penerapan pengetahuan dan keterampilan baru</b>, keberlanjutan proyek perubahan, peningkatan kepercayaan diri dalam menangani tugas yang lebih menantang, serta penilaian positif terhadap perubahan perilaku setelah pelatihan.<br>
            Dengan demikian, <b style="color:green;">dukungan sosial dari atasan dan rekan kerja</b> dinilai sangat berarti dan berdampak signifikan terhadap perkembangan profesional alumni di tempat kerja.
          </p>
          ${dukunganData ? Object.entries(dukunganData.frekuensi).map(([pertanyaan, pelatihans]) => `
            <h4>${pertanyaan}</h4>
            <table>
              <tr><th>Nama Pelatihan</th><th>Sangat Setuju</th><th>Setuju</th><th>Tidak Setuju</th></tr>
              ${(Array.isArray(pelatihans) ? pelatihans as Array<{ namaPelatihan: string; frekuensi: Record<string, number> }> : []).map((p) => `
                <tr>
                  <td>${p.namaPelatihan}</td>
                  <td>${p.frekuensi["4 - Sangat Setuju"] || 0}</td>
                  <td>${p.frekuensi["3 - Setuju"] || 0}</td>
                  <td>${p.frekuensi["2 - Tidak Setuju"] || 0}</td>
                </tr>
              `).join("")}
            </table>
          `).join("") : "<p style='color:red;'>Data dukungan tidak tersedia.</p>"}
        </div>
            <h3>2. Sikap dan Perilaku</h3>
          <p>
            Berikut adalah rekap sikap dan perilaku alumni setelah pelatihan berdasarkan kategori sikap utama.<br>
            <b style="color:purple;">Grafik dapat dilihat di dashboard admin.</b>
          </p>
          ${sikapData ? sikapData.data.map((pel: { namaPelatihan: string; sikapData: { kategori: string; jumlah: number }[] }) => `
            <h4>${pel.namaPelatihan}</h4>
            <table>
              <tr><th>Kategori Sikap</th><th>Jumlah</th></tr>
              ${pel.sikapData.map((s: { kategori: string; jumlah: number }) => `
                <tr>
                  <td>${s.kategori}</td>
                  <td>${s.jumlah}</td>
                </tr>
              `).join("")}
            </table>
          `).join("") : "<p style='color:red;'>Data sikap tidak tersedia.</p>"}
        </div>
          <h3>3. Kesesuaian Waktu</h3>
          <p>
            Berikut adalah analisis kesesuaian waktu pelaksanaan pelatihan menurut alumni.<br>
            <b style="color:purple;">Grafik dapat dilihat di dashboard admin.</b>
          </p>
          ${waktuData ? waktuData.data.map((row: { namaPelatihan: string; data: Record<string, number> }) => `
            <h4>${row.namaPelatihan}</h4>
            <table>
              <tr><th>Respon</th><th>Jumlah</th></tr>
              ${Object.entries(row.data).map(([respon, jumlah]) => `
                <tr>
                  <td>${respon}</td>
                  <td>${jumlah}</td>
                </tr>
              `).join("")}
            </table>
          `).join("") : "<p style='color:red;'>Data kesesuaian waktu tidak tersedia.</p>"}
        </div>
          <h3>4. Peer Review</h3>
          <p>
            Berikut adalah penilaian alumni dari atasan, bawahan, dan rekan kerja terkait hasil pelatihan.<br>
            <b style="color:purple;">Grafik dapat dilihat di dashboard admin.</b>
          </p>
          ${reviewData ? reviewData.data.map((row: { namaPelatihan: string; frekuensi: Record<string, Record<string, number>> }) => `
            <h4>${row.namaPelatihan}</h4>
            ${Object.entries(row.frekuensi).map(([pertanyaan, freq]) => `
              <b>${pertanyaan}</b>
              <table>
                <tr><th>Respon</th><th>Jumlah</th></tr>
                ${Object.entries(freq as Record<string, number>).map(([respon, jumlah]) => `
                  <tr>
                    <td>${respon}</td>
                    <td>${jumlah}</td>
                  </tr>
                `).join("")}
              </table>
            `).join("")}
          `).join("") : "<p style='color:red;'>Data peer review tidak tersedia.</p>"}
        </div>
      </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: { "Content-Type": "text/html" },
  });
}
