'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { toast } from 'sonner';

const normalizeAnswers = (rawValue: unknown): Record<string, string> => {
  try {
    if (!rawValue) return {};
    let source: Record<string, unknown> | null = null;

    if (typeof rawValue === "string") {
      const parsed = JSON.parse(rawValue);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        source = parsed as Record<string, unknown>;
      }
    } else if (typeof rawValue === "object" && !Array.isArray(rawValue)) {
      source = rawValue as Record<string, unknown>;
    }

    if (!source) return {};
    const result: Record<string, string> = {};
    for (const key in source) {
      if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
      const value = source[key];
      result[String(key)] = value == null ? "" : String(value);
    }
    return result;
  } catch {
    return {};
  }
};

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
    telepon: string;
    instansi: string;
    jabatan: string;
    pelatihan: string;
    tahun_pelatihan: string;
    domisili: string;
    instansi_kategori: string;
    lemdik?: string;
  };
  category?: {
    name: string;
  };
}

export default function HasilSurveyPage() {
  const [data, setData] = useState<AnswerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    instansi: 'all',
    pelatihan: 'all'
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal state
  const [selectedUser, setSelectedUser] = useState<typeof uniqueData[0] | null>(null);

  // Options for filters
  const [options, setOptions] = useState({
    instansi: [] as { id: number; agency_name: string }[],
    pelatihan: [] as { id: number; nama: string }[]
  });

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    try {
      const [instansiRes, pelatihanRes] = await Promise.all([
        fetch('/api/instansi'),
        fetch('/api/pelatihan')
      ]);

      const instansiData = instansiRes.ok ? await instansiRes.json() : [];
      const pelatihanData = pelatihanRes.ok ? await pelatihanRes.json() : [];

      setOptions({
        instansi: Array.isArray(instansiData) ? instansiData : [],
        pelatihan: Array.isArray(pelatihanData) ? pelatihanData : []
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
      setData(result.data || []);
    } catch (error) {
      toast.error('Gagal memuat data survey');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Group data by user and pelatihan
  const groupedData = data.reduce((acc, item) => {
    const key = `${item.user_id}-${item.user?.pelatihan || 'unknown'}`;
    if (!acc[key]) {
      acc[key] = {
        user_id: item.user_id,
        user: item.user,
        pelatihan: item.user?.pelatihan || '',
        tahun_pelatihan: item.user?.tahun_pelatihan || '',
        answers: [],
        categories: new Set()
      };
    }
    acc[key].answers.push(item);
    acc[key].categories.add(item.category_id);
    return acc;
  }, {} as Record<string, {
    user_id: number;
    user?: AnswerData['user'];
    pelatihan: string;
    tahun_pelatihan: string;
    answers: AnswerData[];
    categories: Set<number>;
  }>);

  const uniqueData = Object.values(groupedData);

  const filteredData = uniqueData.filter(item => {
    if (selectedCategory && !item.categories.has(selectedCategory)) return false;
    if (filters.instansi !== 'all' && item.user?.instansi !== filters.instansi) return false;
    if (filters.pelatihan !== 'all' && item.pelatihan !== filters.pelatihan) return false;
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, filters, rowsPerPage]);

  const categories = Array.from(new Set(data.map(item => item.category_id)))
    .map(id => ({
      id,
      name: data.find(item => item.category_id === id)?.category?.name || `Category ${id}`,
      count: uniqueData.filter(item => item.categories.has(id)).length
    }));

  // Download CSV function
  const downloadCSV = () => {
    try {
      // Prepare CSV headers
      const headers = [
        'Nama',
        'NIP',
        'Email',
        'Telepon',
        'Instansi',
        'Jabatan',
        'Pelatihan',
        'Tahun Pelatihan',
        'Domisili',
        'Instansi Kategori',
        'Lemdik',
        'Jumlah Jawaban',
        'Kategori Survey',
        'Tanggal Terakhir Submit'
      ];

      // Prepare CSV data
      const csvData = filteredData.map(item => [
        item.user?.name || '',
        item.user?.nip || '',
        item.user?.email || '',
        item.user?.telepon || '',
        item.user?.instansi || '',
        item.user?.jabatan || '',
        item.pelatihan || '',
        item.tahun_pelatihan || '',
        item.user?.domisili || '',
        item.user?.instansi_kategori || '',
        item.user?.lemdik || '',
        item.answers.length.toString(),
        Array.from(item.categories).map(id => data.find(d => d.category_id === id)?.category?.name).filter(Boolean).join('; '),
        new Date(Math.max(...item.answers.map(a => new Date(a.created_at).getTime()))).toLocaleDateString('id-ID')
      ]);

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `hasil-survey-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('File CSV berhasil diunduh');
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Gagal mengunduh file CSV');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hasil Survey</h1>
        <p className="text-muted-foreground">Tabel hasil survey responden</p>
      </div>

      {/* Category Filter */}
      <Card className="border-2 border-green-300 bg-green-100 shadow-md">
        <CardHeader>
          <CardTitle>Kategori Survey</CardTitle>
          <CardDescription>Pilih kategori untuk melihat hasil survey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              Semua ({uniqueData.length})
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name} ({cat.count})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Filters */}
      <Card className="border-2 border-blue-300 bg-blue-100 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Filter className="h-5 w-5" />
            Filter Tambahan
          </CardTitle>
          <CardDescription>Filter berdasarkan Instansi, Pelatihan, dan Lemdik</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          {loadingOptions ? (
            <div className="flex justify-center items-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Memuat opsi filter...</span>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Instansi</label>
                <Select
                  value={filters.instansi}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, instansi: value }))}
                >
                  <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-60">
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
                <label className="text-sm font-medium">Pelatihan</label>
                <Select
                  value={filters.pelatihan}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, pelatihan: value }))}
                >
                  <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-300 shadow-lg max-h-60">
                    <SelectItem value="all">Semua</SelectItem>
                    {options.pelatihan.map((item) => (
                      <SelectItem key={item.id} value={item.nama}>
                        {item.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Hasil Survey {selectedCategory ? ` - ${categories.find(c => c.id === selectedCategory)?.name}` : ''}</CardTitle>
                <CardDescription>
                  Total {filteredData.length} responden unik
                </CardDescription>
              </div>
              <Button onClick={downloadCSV} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NIP</TableHead>
                    <TableHead>Instansi</TableHead>
                    <TableHead>Pelatihan</TableHead>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Domisili</TableHead>
                    <TableHead>Jumlah Jawaban</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Tanggal Terakhir</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={`${item.user_id}-${item.pelatihan}`}>
                      <TableCell>{item.user?.name || '-'}</TableCell>
                      <TableCell>{item.user?.nip || '-'}</TableCell>
                      <TableCell>{item.user?.instansi || '-'}</TableCell>
                      <TableCell>{item.pelatihan || '-'}</TableCell>
                      <TableCell>{item.tahun_pelatihan || '-'}</TableCell>
                      <TableCell>{item.user?.domisili || '-'}</TableCell>
                      <TableCell>{item.answers.length}</TableCell>
                      <TableCell>{Array.from(item.categories).map(id => data.find(d => d.category_id === id)?.category?.name).filter(Boolean).join(', ')}</TableCell>
                      <TableCell>{new Date(Math.max(...item.answers.map(a => new Date(a.created_at).getTime()))).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(item)}>
                              <Eye className="h-5 w-5 text-blue-500 hover:text-blue-700" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border-2 border-gray-300 shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-bold">Detail Jawaban - {selectedUser?.user?.name}</DialogTitle>
                              <DialogDescription className="text-sm text-gray-600">
                                NIP: {selectedUser?.user?.nip} | Instansi: {selectedUser?.user?.instansi} | Pelatihan: {selectedUser?.pelatihan}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                              {selectedUser?.answers.map((answer, index) => {
                                const answersObj = normalizeAnswers(answer.answers);
                                const answerKeys = Object.keys(answersObj);
                                return (
                                  <div key={index} className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                    <div className="font-medium text-sm text-gray-700 mb-4">
                                      Kategori: {data.find(d => d.category_id === answer.category_id)?.category?.name}
                                    </div>
                                    <div className="space-y-4">
                                      {answerKeys.length === 0 ? (
                                        <div className="text-sm text-gray-500">Tidak ada jawaban untuk kategori ini.</div>
                                      ) : (
                                        answerKeys.map((key) => {
                                          const userAnswer = answersObj[key];
                                          return (
                                            <div key={key} className="border-b border-gray-100 pb-3 last:border-b-0">
                                              <div className="text-sm text-blue-600 bg-gray-100 p-2 rounded">
                                                {userAnswer || 'Tidak dijawab'}
                                              </div>
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                    <div className="mt-4 text-xs text-gray-500">
                                      Tanggal: {new Date(answer.created_at).toLocaleString('id-ID')}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Tampilkan</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => setRowsPerPage(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">baris per halaman</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm">
            Halaman {currentPage} dari {totalPages} (Total {filteredData.length} data)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}