'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleExport1to7 = () => {
    setExporting1to7(true);
    exportToCSV(
      dataCategory1to7,
      'jawaban_epp_alumni',
      'EPP Alumni'
    );
    setExporting1to7(false);
  };

  const handleExport6 = () => {
    setExporting6(true);
    exportToCSV(
      dataCategory6,
      'jawaban_epp_atasan_bawahan',
      'EPP Atasan Bawahan'
    );
    setExporting6(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Unduh Data Raw</h1>
        <p className="text-muted-foreground">Data mentah jawaban responden dalam format CSV</p>
      </div>

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
                Total {dataCategory1to7.length} records
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
              <Button 
                onClick={handleExport1to7} 
                disabled={exporting1to7 || dataCategory1to7.length === 0}
                className="w-full"
              >
                {exporting1to7 ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Data EPP Alumni
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Card untuk Category 6 */}
          <Card>
            <CardHeader>
              <CardTitle>EPP Atasan Bawahan</CardTitle>
              <CardDescription>
                Total {dataCategory6.length} records
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
              <Button 
                onClick={handleExport6} 
                disabled={exporting6 || dataCategory6.length === 0}
                className="w-full"
              >
                {exporting6 ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Data EPP Atasan Bawahan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
