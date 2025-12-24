'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Loader2, Filter } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

interface ExcelRowData {
  'Nama': string;
  'NIP': string;
  'Telepon': string;
  'Instansi': string;
  'Instansi ID': string | number;
  'Instansi Kategori ID': string | number;
  'Instansi Kategori': string;
  'Tahun Pelatihan ID': string | number;
  'Tahun Pelatihan': string;
  'Pelatihan ID': string | number;
  'Pelatihan': string;
  'Domisili ID': string | number;
  'Domisili': string;
  'Lemdik': string;
  'Jabatan': string;
  'Category ID': number;
  'Category Name': string;
  'Created At': string;
  'Question Key': string;
  'Question Text': string;
  'Answer': string;
}

interface AnswerData {
  id: number;
  user_id: number;
  created_at: string;
  answers: Record<string, unknown> | string | null;
  category_id: number;
  user?: {
    name: string;
    email: string;
    nip: string;
    instansi: string;
    jabatan: string;
    telepon: string;
    instansi_id: number | null;
    instansi_kategori_id: number | null;
    tahun_pelatihan_id: number | null;
    pelatihan_id: number | null;
    domisili_id: number | null;
    lemdik: string;
    pelatihan: string;
    tahun_pelatihan: string;
    domisili: string;
    instansi_kategori: string;
  };
  category?: {
    name: string;
  };
  questions?: {
    question_key: string;
    question_text: string;
  }[];
}

export default function UnduhDataPage() {
  const [dataCategory1to7, setDataCategory1to7] = useState<AnswerData[]>([]);
  const [dataCategory6, setDataCategory6] = useState<AnswerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting1to7, setExporting1to7] = useState(false);
  const [exporting6, setExporting6] = useState(false);
  const [exportingExcel1to7, setExportingExcel1to7] = useState(false);
  const [exportingExcel6, setExportingExcel6] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    namaPelatihan: 'all',
    tahunPelatihan: 'all',
    instansi: 'all',
    domisili: 'all'
  });

  // Options for filters
  const [options, setOptions] = useState({
    pelatihan: [] as { id: number; nama: string }[],
    tahunPelatihan: [] as { id: number; tahun: string }[],
    instansi: [] as { id: number; agency_name: string }[],
    provinsi: [] as { id: number; nama: string }[]
  });

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const [pelatihanRes, tahunRes, instansiRes, provinsiRes] = await Promise.all([
        fetch('/api/pelatihan'),
        fetch('/api/tahun_pelatihan'),
        fetch('/api/instansi'),
        fetch('/api/provinsi')
      ]);

      const pelatihanData = pelatihanRes.ok ? await pelatihanRes.json() : [];
      const tahunData = tahunRes.ok ? await tahunRes.json() : [];
      const instansiData = instansiRes.ok ? await instansiRes.json() : [];
      const provinsiData = provinsiRes.ok ? await provinsiRes.json() : [];

      setOptions({
        pelatihan: Array.isArray(pelatihanData) ? pelatihanData : [],
        tahunPelatihan: Array.isArray(tahunData) ? tahunData : [],
        instansi: Array.isArray(instansiData) ? instansiData : [],
        provinsi: Array.isArray(provinsiData) ? provinsiData : []
      });
    } catch (error) {
      console.error('Error fetching options:', error);
      toast.error('Gagal memuat opsi filter');
    } finally {
      setLoadingOptions(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/answers-raw');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      
      const allData = result.data || [];
      
      // Pisahkan data berdasarkan category_id
      const cat1to7 = allData.filter((item: AnswerData) => 
        [1, 2, 3, 4, 7].includes(item.category_id)
      );
      const cat6 = allData.filter((item: AnswerData) => 
        item.category_id === 6
      );
      
      setDataCategory1to7(cat1to7);
      setDataCategory6(cat6);
    } catch (error) {
      toast.error('Gagal memuat data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const filterData = (data: AnswerData[]) => {
    return data.filter(item => {
      if (filters.namaPelatihan && filters.namaPelatihan !== 'all' && item.user?.pelatihan !== filters.namaPelatihan) return false;
      if (filters.tahunPelatihan && filters.tahunPelatihan !== 'all' && item.user?.tahun_pelatihan !== filters.tahunPelatihan) return false;
      if (filters.instansi && filters.instansi !== 'all' && item.user?.instansi !== filters.instansi) return false;
      if (filters.domisili && filters.domisili !== 'all' && item.user?.domisili !== filters.domisili) return false;
      return true;
    });
  };

  const exportToCSV = (data: AnswerData[], filename: string, categoryLabel: string) => {
    try {
      // Header CSV dengan informasi lengkap user
      const headers = [
        'Nama',
        'NIP',
        'Telepon',
        'Instansi',
        'Instansi ID',
        'Instansi Kategori ID',
        'Instansi Kategori',
        'Tahun Pelatihan ID',
        'Tahun Pelatihan',
        'Pelatihan ID',
        'Pelatihan',
        'Domisili ID',
        'Domisili',
        'Lemdik',
        'Jabatan',
        'Category ID',
        'Category Name',
        'Created At',
        'Question Key',
        'Question Text',
        'Answer'
      ];

      const csvRows = [headers.join(',')];

      data.forEach(row => {
        const questions = row.questions || [];
        const answersRecord = (() => {
          const output: Record<string, string> = {};
          const raw = row.answers;

          if (!raw) return output;

          if (typeof raw === 'string') {
            try {
              const parsed = JSON.parse(raw);
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                for (const key in parsed as Record<string, unknown>) {
                  if (!Object.prototype.hasOwnProperty.call(parsed, key)) continue;
                  const value = (parsed as Record<string, unknown>)[key];
                  output[key] = value == null ? '' : String(value);
                }
              }
            } catch {
              // ignore malformed JSON
            }
            return output;
          }

          if (typeof raw === 'object' && !Array.isArray(raw)) {
            for (const key in raw as Record<string, unknown>) {
              if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
              const value = (raw as Record<string, unknown>)[key];
              output[key] = value == null ? '' : String(value);
            }
          }

          return output;
        })();

        for (const questionKey in answersRecord) {
          if (!Object.prototype.hasOwnProperty.call(answersRecord, questionKey)) continue;
          const answer = answersRecord[questionKey];
          const questionData = questions.find(q => q.question_key === questionKey);
          const questionText = questionData?.question_text || questionKey;

          csvRows.push([
            `"${row.user?.name || ''}"`,
            `"${row.user?.nip || ''}"`,
            `"${row.user?.telepon || ''}"`,
            `"${row.user?.instansi || ''}"`,
            `"${row.user?.instansi_id ?? ''}"`,
            `"${row.user?.instansi_kategori_id ?? ''}"`,
            `"${row.user?.instansi_kategori || ''}"`,
            `"${row.user?.tahun_pelatihan_id ?? ''}"`,
            `"${row.user?.tahun_pelatihan || ''}"`,
            `"${row.user?.pelatihan_id ?? ''}"`,
            `"${row.user?.pelatihan || ''}"`,
            `"${row.user?.domisili_id ?? ''}"`,
            `"${row.user?.domisili || ''}"`,
            `"${row.user?.lemdik || ''}"`,
            `"${row.user?.jabatan || ''}"`,
            row.category_id,
            `"${row.category?.name || ''}"`,
            new Date(row.created_at).toISOString(),
            `"${questionKey}"`,
            `"${questionText.replace(/"/g, '""')}"`,
            `"${String(answer).replace(/"/g, '""').replace(/\r\n/g, ' ').replace(/\n/g, ' ')}"`
          ].join(','));
        }
      });

      // Download CSV
      const csvContent = '\uFEFF' + csvRows.join('\n'); // BOM untuk Excel
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      toast.success(`Data ${categoryLabel} berhasil diunduh`);
    } catch (error) {
      toast.error('Gagal mengunduh data');
      console.error(error);
    }
  };

  const exportToExcel = (data: AnswerData[], filename: string, categoryLabel: string) => {
    try {
      const excelData: ExcelRowData[] = [];

      data.forEach(row => {
        const questions = row.questions || [];
        const answersRecord = (() => {
          const output: Record<string, string> = {};
          const raw = row.answers;

          if (!raw) return output;

          if (typeof raw === 'string') {
            try {
              const parsed = JSON.parse(raw);
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                for (const key in parsed as Record<string, unknown>) {
                  if (!Object.prototype.hasOwnProperty.call(parsed, key)) continue;
                  const value = (parsed as Record<string, unknown>)[key];
                  output[key] = value == null ? '' : String(value);
                }
              }
            } catch {
              // ignore malformed JSON
            }
            return output;
          }

          if (typeof raw === 'object' && !Array.isArray(raw)) {
            for (const key in raw as Record<string, unknown>) {
              if (!Object.prototype.hasOwnProperty.call(raw, key)) continue;
              const value = (raw as Record<string, unknown>)[key];
              output[key] = value == null ? '' : String(value);
            }
          }

          return output;
        })();

        for (const questionKey in answersRecord) {
          if (!Object.prototype.hasOwnProperty.call(answersRecord, questionKey)) continue;
          const answer = answersRecord[questionKey];
          const questionData = questions.find(q => q.question_key === questionKey);
          const questionText = questionData?.question_text || questionKey;

          excelData.push({
            'Nama': row.user?.name || '',
            'NIP': row.user?.nip || '',
            'Telepon': row.user?.telepon || '',
            'Instansi': row.user?.instansi || '',
            'Instansi ID': row.user?.instansi_id ?? '',
            'Instansi Kategori ID': row.user?.instansi_kategori_id ?? '',
            'Instansi Kategori': row.user?.instansi_kategori || '',
            'Tahun Pelatihan ID': row.user?.tahun_pelatihan_id ?? '',
            'Tahun Pelatihan': row.user?.tahun_pelatihan || '',
            'Pelatihan ID': row.user?.pelatihan_id ?? '',
            'Pelatihan': row.user?.pelatihan || '',
            'Domisili ID': row.user?.domisili_id ?? '',
            'Domisili': row.user?.domisili || '',
            'Lemdik': row.user?.lemdik || '',
            'Jabatan': row.user?.jabatan || '',
            'Category ID': row.category_id,
            'Category Name': row.category?.name || '',
            'Created At': new Date(row.created_at).toISOString(),
            'Question Key': questionKey,
            'Question Text': questionText,
            'Answer': String(answer).replace(/\r\n/g, ' ').replace(/\n/g, ' ')
          });
        }
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Auto-size columns
      const colWidths = [
        { wch: 20 }, // Nama
        { wch: 15 }, // NIP
        { wch: 15 }, // Telepon
        { wch: 25 }, // Instansi
        { wch: 12 }, // Instansi ID
        { wch: 20 }, // Instansi Kategori ID
        { wch: 20 }, // Instansi Kategori
        { wch: 18 }, // Tahun Pelatihan ID
        { wch: 15 }, // Tahun Pelatihan
        { wch: 12 }, // Pelatihan ID
        { wch: 25 }, // Pelatihan
        { wch: 12 }, // Domisili ID
        { wch: 15 }, // Domisili
        { wch: 15 }, // Lemdik
        { wch: 20 }, // Jabatan
        { wch: 12 }, // Category ID
        { wch: 20 }, // Category Name
        { wch: 20 }, // Created At
        { wch: 15 }, // Question Key
        { wch: 40 }, // Question Text
        { wch: 50 }  // Answer
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Data');

      // Generate and download file
      XLSX.writeFile(wb, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);

      toast.success(`Data ${categoryLabel} berhasil diunduh sebagai Excel`);
    } catch (error) {
      toast.error('Gagal mengunduh data Excel');
      console.error(error);
    }
  };

  const handleExport1to7 = () => {
    setExporting1to7(true);
    const filteredData = filterData(dataCategory1to7);
    exportToCSV(
      filteredData,
      'jawaban_epp_alumni',
      'EPP Alumni'
    );
    setExporting1to7(false);
  };

  const handleExport6 = () => {
    setExporting6(true);
    const filteredData = filterData(dataCategory6);
    exportToCSV(
      filteredData,
      'jawaban_epp_atasan_bawahan',
      'EPP Atasan Bawahan'
    );
    setExporting6(false);
  };

  const handleExportExcel1to7 = () => {
    setExportingExcel1to7(true);
    const filteredData = filterData(dataCategory1to7);
    exportToExcel(
      filteredData,
      'jawaban_epp_alumni',
      'EPP Alumni'
    );
    setExportingExcel1to7(false);
  };

  const handleExportExcel6 = () => {
    setExportingExcel6(true);
    const filteredData = filterData(dataCategory6);
    exportToExcel(
      filteredData,
      'jawaban_epp_atasan_bawahan',
      'EPP Atasan Bawahan'
    );
    setExportingExcel6(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Unduh Data Raw</h1>
        <p className="text-muted-foreground">Data mentah jawaban responden dalam format CSV</p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Data
          </CardTitle>
          <CardDescription>
            Pilih filter untuk menyaring data yang akan diunduh
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          {loadingOptions ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Memuat opsi filter...</span>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Pelatihan</label>
                  <Select
                    value={filters.namaPelatihan}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, namaPelatihan: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {options.pelatihan.map((item) => (
                        <SelectItem key={item.id} value={item.nama}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tahun Pelatihan</label>
                  <Select
                    value={filters.tahunPelatihan}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, tahunPelatihan: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {options.tahunPelatihan.map((item) => (
                        <SelectItem key={item.id} value={item.tahun}>
                          {item.tahun}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Instansi</label>
                  <Select
                    value={filters.instansi}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, instansi: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {options.instansi.map((item) => (
                        <SelectItem key={item.id} value={item.agency_name}>
                          {item.agency_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Domisili</label>
                  <Select
                    value={filters.domisili}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, domisili: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Semua" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      {options.provinsi.map((item) => (
                        <SelectItem key={item.id} value={item.nama}>
                          {item.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setFilters({ namaPelatihan: 'all', tahunPelatihan: 'all', instansi: 'all', domisili: 'all' })}
                >
                  Reset Filter
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card untuk Category 1, 2, 3, 4, 7 */}
          <Card>
            <CardHeader>
              <CardTitle>EPP Alumni</CardTitle>
              <CardDescription>
                Total {filterData(dataCategory1to7).length} records (dari {dataCategory1to7.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">Preview Data:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Nama, NIP, Telepon</li>
                  <li>Instansi, Instansi ID, Instansi Kategori ID</li>
                  <li>Tahun Pelatihan ID, Pelatihan ID, Domisili ID, Lemdik</li>
                  <li>Jabatan, Category ID, Category Name</li>
                  <li>Created At, Question Key, Question Text, Answer</li>
                </ul>
                <p className="text-xs mt-4">
                  Format: 1 baris per pertanyaan yang dijawab
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={handleExport1to7} 
                  disabled={exporting1to7 || dataCategory1to7.length === 0}
                  className="w-full"
                  variant="default"
                >
                  {exporting1to7 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengunduh CSV...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Unduh CSV - EPP Alumni
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleExportExcel1to7} 
                  disabled={exportingExcel1to7 || dataCategory1to7.length === 0}
                  className="w-full"
                  variant="outline"
                >
                  {exportingExcel1to7 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengunduh Excel...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Unduh Excel - EPP Alumni
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card untuk Category 6 */}
          <Card>
            <CardHeader>
              <CardTitle>EPP Atasan Bawahan</CardTitle>
              <CardDescription>
                Total {filterData(dataCategory6).length} records (dari {dataCategory6.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">Preview Data:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Nama, NIP, Telepon</li>
                  <li>Instansi, Instansi ID, Instansi Kategori ID</li>
                  <li>Tahun Pelatihan ID, Pelatihan ID, Domisili ID, Lemdik</li>
                  <li>Jabatan, Category ID, Category Name</li>
                  <li>Created At, Question Key, Question Text, Answer</li>
                </ul>
                <p className="text-xs mt-4">
                  Format: 1 baris per pertanyaan yang dijawab
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={handleExport6} 
                  disabled={exporting6 || dataCategory6.length === 0}
                  className="w-full"
                  variant="default"
                >
                  {exporting6 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengunduh CSV...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Unduh CSV - EPP Atasan Bawahan
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleExportExcel6} 
                  disabled={exportingExcel6 || dataCategory6.length === 0}
                  className="w-full"
                  variant="outline"
                >
                  {exportingExcel6 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengunduh Excel...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Unduh Excel - EPP Atasan Bawahan
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
