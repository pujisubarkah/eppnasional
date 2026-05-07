"use client";

import { useEffect, useMemo, useState } from "react";
import {
	Activity,
	BookOpen,
	Brain,
	CalendarClock,
	ChevronRight,
	Filter,
	Layers3,
	MessageSquareText,
	Moon,
	RefreshCcw,
	ShieldCheck,
	Sparkles,
	Star,
	Sun,
	Users,
} from "lucide-react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type DashboardTab = "overview" | "materi" | "dukungan" | "sikap" | "waktu" | "saran" | "review";
type SaranCategory = "metode" | "materi" | "waktu" | "pengajar";
type NgramType = "bigram" | "trigram";
type SikapGroupKey = "sikapData" | "kinerjaData" | "ekonomiData" | "temaData" | "transformasiData" | "subBidangData";
type ThemeMode = "light" | "dark";

type ThemeClasses = {
	pageBg: string;
	loadingBg: string;
	errorBg: string;
	baseText: string;
	heroCard: string;
	heroBadge: string;
	heroBadgeText: string;
	heroStatsCard: string;
	filterCard: string;
	filterLabel: string;
	input: string;
	resetButton: string;
	tabBar: string;
	tabActive: string;
	tabInactive: string;
	panel: string;
	panelBorder: string;
	panelIconWrap: string;
	panelTitle: string;
	panelSubtitle: string;
	metricCard: string;
	metricBadge: string;
	metricTitle: string;
	metricValue: string;
	metricDescription: string;
	surfaceCard: string;
	surfaceStrong: string;
	surfaceMuted: string;
	textPrimary: string;
	textSecondary: string;
	textMuted: string;
	textSoft: string;
	chartGrid: string;
	axisTick: string;
	axisTickStrong: string;
	tooltipBox: string;
	tooltipTitle: string;
	tooltipRow: string;
	tooltipValue: string;
	chartCursor: string;
	pieRest: string;
	toggleButton: string;
	toggleThumb: string;
};

type TrainingOption = {
	key: string;
	id: number | null;
	name: string;
};

type MateriApi = {
	result: Array<{
		jawabanId: number;
		userId: number;
		pelatihanId: number | null;
		namaPelatihan: string;
		relevan: Record<string, string>;
		tidakRelevan: Record<string, string>;
	}>;
	frekuensi: {
		relevan: Record<string, number>;
		tidakRelevan: Record<string, number>;
	};
	frekuensiPerPelatihan: Record<
		string,
		{
			namaPelatihan: string;
			relevan: Record<string, number>;
			tidakRelevan: Record<string, number>;
		}
	>;
};

type DukunganApi = {
	frekuensi: Record<
		string,
		Array<{
			pelatihanId: number | null;
			namaPelatihan: string | null;
			frekuensi: Record<string, number>;
		}>
	>;
};

type SikapItem = {
	kategori: string;
	jumlah: number;
};

type SikapEntry = {
	pelatihanId: number | null;
	namaPelatihan: string | null;
	sikapData: SikapItem[];
	kinerjaData: SikapItem[];
	ekonomiData: SikapItem[];
	temaData: SikapItem[];
	transformasiData: SikapItem[];
	subBidangData: SikapItem[];
};

type SikapApi = {
	data: SikapEntry[];
};

type WaktuApi = {
	data: Array<{
		pelatihanId: number | null;
		namaPelatihan: string | null;
		data: Record<string, number>;
	}>;
};

type Ngram = {
	bigram: Record<string, number>;
	trigram: Record<string, number>;
};

type SaranPelatihanData = {
	pelatihanId: number | null;
	namaPelatihan: string | null;
	data: Record<SaranCategory, string[]>;
	ngram: Record<SaranCategory, Ngram>;
};

type SaranApi = {
	data: Record<SaranCategory, string[]>;
	ngram: Record<SaranCategory, Ngram>;
	pelatihanList?: Array<{
		pelatihanId: number;
		namaPelatihan: string;
	}>;
	pelatihanData?: SaranPelatihanData[];
};

type ReviewApi = {
	data: Array<{
		pelatihanId: number | null;
		namaPelatihan: string | null;
		frekuensi: Record<string, Record<string, number>>;
	}>;
};

type DashboardData = {
	materi: MateriApi;
	dukungan: DukunganApi;
	sikap: SikapApi;
	waktu: WaktuApi;
	saran: SaranApi;
	review: ReviewApi;
};

type ChartDatum = {
	name: string;
	value: number;
	fullName?: string;
};

type WordCloudItem = {
	text: string;
	value: number;
	fontSize: number;
	accentClass: string;
	rotationClass: string;
};

type LikertRow = {
	question: string;
	fullQuestion: string;
	total: number;
	positiveRate: number;
} & Record<string, number | string>;

const tabs: Array<{ key: DashboardTab; label: string; icon: typeof Sparkles }> = [
	{ key: "overview", label: "Ikhtisar", icon: Sparkles },
	{ key: "materi", label: "Materi", icon: BookOpen },
	{ key: "dukungan", label: "Dukungan", icon: Users },
	{ key: "sikap", label: "Perilaku & Kinerja", icon: Brain },
	{ key: "waktu", label: "Waktu & Manfaat", icon: CalendarClock },
	{ key: "saran", label: "Saran", icon: MessageSquareText },
	{ key: "review", label: "Penilaian Rekan", icon: Star },
];

const likertOrder = [
	"1 - Sangat Tidak Setuju",
	"2 - Tidak Setuju",
	"3 - Setuju",
	"4 - Sangat Setuju",
];

const likertColors: Record<string, string> = {
	"1 - Sangat Tidak Setuju": "#ef4444",
	"2 - Tidak Setuju": "#f59e0b",
	"3 - Setuju": "#38bdf8",
	"4 - Sangat Setuju": "#6366f1",
};

const sikapGroupMeta: Record<SikapGroupKey, { label: string; tone: string }> = {
	sikapData: { label: "Sikap", tone: "from-fuchsia-500/20 to-purple-500/20" },
	kinerjaData: { label: "Kinerja", tone: "from-sky-500/20 to-cyan-500/20" },
	ekonomiData: { label: "Dampak Ekonomi", tone: "from-emerald-500/20 to-green-500/20" },
	temaData: { label: "Tema", tone: "from-amber-500/20 to-orange-500/20" },
	transformasiData: { label: "Bidang", tone: "from-indigo-500/20 to-blue-500/20" },
	subBidangData: { label: "Sub Bidang", tone: "from-pink-500/20 to-rose-500/20" },
};

const saranLabels: Record<SaranCategory, string> = {
	metode: "Metode",
	materi: "Materi",
	waktu: "Waktu",
	pengajar: "Pengajar",
};

const saranStopWords = new Set([
	"yang",
	"dan",
	"untuk",
	"dengan",
	"agar",
	"supaya",
	"lebih",
	"dalam",
	"pada",
	"dari",
	"atau",
	"karena",
	"juga",
	"sudah",
	"belum",
	"bisa",
	"dapat",
	"harus",
	"tetap",
	"sehingga",
	"terkait",
	"mohon",
	"perlu",
	"oleh",
	"saja",
	"akan",
	"sangat",
	"sekali",
	"semoga",
	"semakin",
	"nya",
	"itu",
	"ini",
	"jadi",
	"buat",
	"serta",
	"the",
	"dan",
	"di",
	"ke",
	"lebih",
	"lagi",
	"sih",
	"nih",
	"ya",
	"yg",
	"utk",
	"karna",
	"biar",
	"para",
	"satu",
	"dua",
	"dapat",
	"sama",
	"dalamnya",
	"pelatihan",
]);

const wordCloudAccentsLight = [
	"bg-cyan-500/12 text-cyan-700 border-cyan-200/80",
	"bg-indigo-500/12 text-indigo-700 border-indigo-200/80",
	"bg-emerald-500/12 text-emerald-700 border-emerald-200/80",
	"bg-amber-500/12 text-amber-700 border-amber-200/80",
	"bg-rose-500/12 text-rose-700 border-rose-200/80",
	"bg-violet-500/12 text-violet-700 border-violet-200/80",
];

const wordCloudAccentsDark = [
	"bg-cyan-400/12 text-cyan-100 border-cyan-400/20",
	"bg-indigo-400/12 text-indigo-100 border-indigo-400/20",
	"bg-emerald-400/12 text-emerald-100 border-emerald-400/20",
	"bg-amber-400/12 text-amber-100 border-amber-400/20",
	"bg-rose-400/12 text-rose-100 border-rose-400/20",
	"bg-violet-400/12 text-violet-100 border-violet-400/20",
];

const wordCloudRotations = ["-rotate-2", "rotate-0", "rotate-1", "-rotate-1", "rotate-2", "rotate-0"];

function getThemeClasses(mode: ThemeMode): ThemeClasses {
	if (mode === "dark") {
		return {
			pageBg: "bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_25%),radial-gradient(circle_at_right,_rgba(99,102,241,0.14),_transparent_28%),linear-gradient(180deg,_#020617,_#0f172a_50%,_#111827)]",
			loadingBg: "bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_28%),linear-gradient(180deg,_#020617,_#0f172a_46%,_#111827)]",
			errorBg: "bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.18),_transparent_30%),linear-gradient(180deg,_#020617,_#0f172a_46%,_#111827)]",
			baseText: "text-white",
			heroCard: "border-white/10 bg-white/8 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.95)]",
			heroBadge: "border-cyan-400/20 bg-cyan-400/10",
			heroBadgeText: "text-cyan-200",
			heroStatsCard: "border-white/10 bg-slate-950/55",
			filterCard: "border-white/10 bg-slate-950/55",
			filterLabel: "text-white/70",
			input: "border border-white/10 bg-white/8 text-white focus:border-cyan-300/40 focus:bg-white/10",
			resetButton: "border-white/10 bg-white/8 text-white hover:bg-white/12",
			tabBar: "border-white/10 bg-white/6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.9)]",
			tabActive: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25",
			tabInactive: "bg-slate-950/45 text-white/65 hover:bg-white/10 hover:text-white",
			panel: "border-white/10 bg-slate-900/70 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.9)]",
			panelBorder: "border-white/10",
			panelIconWrap: "bg-white/10 text-cyan-200",
			panelTitle: "text-white",
			panelSubtitle: "text-white/55",
			metricCard: "border border-white/10 bg-white/8 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.8)]",
			metricBadge: "border-white/10 bg-white/8 text-white/45",
			metricTitle: "text-white/60",
			metricValue: "text-white",
			metricDescription: "text-white/55",
			surfaceCard: "border border-white/10 bg-white/6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.65)]",
			surfaceStrong: "border border-white/10 bg-slate-950/45 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.6)]",
			surfaceMuted: "border border-white/10 bg-white/8 shadow-[0_14px_35px_-28px_rgba(15,23,42,0.55)]",
			textPrimary: "text-white",
			textSecondary: "text-white/70",
			textMuted: "text-white/55",
			textSoft: "text-white/45",
			chartGrid: "#1e293b",
			axisTick: "#cbd5e1",
			axisTickStrong: "#e2e8f0",
			tooltipBox: "border-white/15 bg-slate-950/95",
			tooltipTitle: "text-white/90",
			tooltipRow: "text-white/70",
			tooltipValue: "text-white",
			chartCursor: "rgba(255,255,255,0.04)",
			pieRest: "#334155",
			toggleButton: "border-white/10 bg-white/10 text-white hover:bg-white/15",
			toggleThumb: "bg-slate-950 text-cyan-300",
		};
	}

	return {
		pageBg: "bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_24%),radial-gradient(circle_at_right,_rgba(99,102,241,0.12),_transparent_25%),linear-gradient(180deg,_#f8fbff,_#eef4ff_45%,_#f8fafc)]",
		loadingBg: "bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,_#f8fbff,_#eef4ff_48%,_#f8fafc)]",
		errorBg: "bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.1),_transparent_28%),linear-gradient(180deg,_#fff7f8,_#fffafb_40%,_#f8fafc)]",
		baseText: "text-slate-900",
		heroCard: "border-slate-200/80 bg-white/88 shadow-[0_35px_120px_-45px_rgba(148,163,184,0.55)]",
		heroBadge: "border-cyan-200 bg-cyan-50",
		heroBadgeText: "text-cyan-700",
		heroStatsCard: "border-slate-200/80 bg-white/92",
		filterCard: "border-slate-200/80 bg-white/92",
		filterLabel: "text-slate-600",
		input: "border border-slate-200 bg-white text-slate-900 shadow-sm focus:border-cyan-400 focus:bg-white",
		resetButton: "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
		tabBar: "border-slate-200/80 bg-white/88 shadow-[0_24px_80px_-40px_rgba(148,163,184,0.45)]",
		tabActive: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20",
		tabInactive: "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
		panel: "border-slate-200/80 bg-white/90 shadow-[0_24px_80px_-35px_rgba(148,163,184,0.45)]",
		panelBorder: "border-slate-200/80",
		panelIconWrap: "bg-cyan-50 text-cyan-700",
		panelTitle: "text-slate-900",
		panelSubtitle: "text-slate-600",
		metricCard: "border border-slate-200/80 bg-white/96 shadow-[0_20px_60px_-30px_rgba(148,163,184,0.4)]",
		metricBadge: "border-slate-200 bg-slate-50 text-slate-500",
		metricTitle: "text-slate-600",
		metricValue: "text-slate-900",
		metricDescription: "text-slate-600",
		surfaceCard: "border border-slate-200/90 bg-white shadow-[0_16px_40px_-30px_rgba(148,163,184,0.42)]",
		surfaceStrong: "border border-slate-200/90 bg-slate-50 shadow-[0_14px_34px_-28px_rgba(148,163,184,0.35)]",
		surfaceMuted: "border border-slate-200/90 bg-slate-100/95 shadow-[0_12px_28px_-24px_rgba(148,163,184,0.3)]",
		textPrimary: "text-slate-900",
		textSecondary: "text-slate-700",
		textMuted: "text-slate-600",
		textSoft: "text-slate-500",
		chartGrid: "#dbe4f0",
		axisTick: "#64748b",
		axisTickStrong: "#475569",
		tooltipBox: "border-slate-200 bg-white/96",
		tooltipTitle: "text-slate-900",
		tooltipRow: "text-slate-600",
		tooltipValue: "text-slate-900",
		chartCursor: "rgba(15,23,42,0.05)",
		pieRest: "#cbd5e1",
		toggleButton: "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
		toggleThumb: "bg-cyan-50 text-cyan-700",
	};
}

function getChipClass(active: boolean, mode: ThemeMode) {
	if (mode === "dark") {
		return active
			? "border border-cyan-300/30 bg-cyan-100 text-slate-950 shadow-sm"
			: "border border-white/10 bg-white/8 text-white/75 hover:bg-white/12 hover:text-white";
	}

	return active
		? "border border-cyan-200 bg-cyan-600 text-white shadow-sm"
		: "border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900";
}

function getAccentChipClass(mode: ThemeMode) {
	return mode === "dark"
		? "border border-cyan-400/15 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20"
		: "border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100";
}

function cn(...values: Array<string | false | null | undefined>) {
	return values.filter(Boolean).join(" ");
}

function safeName(value: string | null | undefined) {
	const trimmed = value?.trim();
	return trimmed && trimmed.length > 0 ? trimmed : "Tidak diketahui";
}

function addTrainingOption(map: Map<string, TrainingOption>, id: number | null | undefined, name: string | null | undefined) {
	const normalizedName = safeName(name);
	const key = id !== null && id !== undefined ? `id:${id}` : `name:${normalizedName}`;
	if (!map.has(key)) {
		map.set(key, {
			key,
			id: id ?? null,
			name: normalizedName,
		});
	}
}

function matchesTraining(option: TrainingOption | null, id: number | null | undefined, name: string | null | undefined) {
	if (!option) return true;
	if (option.id !== null) {
		return option.id === (id ?? null);
	}
	return option.name === safeName(name);
}

function sumRecord(record: Record<string, number>) {
	return Object.values(record).reduce((total, value) => total + value, 0);
}

function mergeRecords(records: Record<string, number>[]) {
	return records.reduce<Record<string, number>>((accumulator, record) => {
		Object.entries(record).forEach(([key, value]) => {
			accumulator[key] = (accumulator[key] ?? 0) + value;
		});
		return accumulator;
	}, {});
}

function sortEntries(record: Record<string, number>, limit = 6): ChartDatum[] {
	return Object.entries(record)
		.filter(([, value]) => value > 0)
		.sort((first, second) => second[1] - first[1])
		.slice(0, limit)
		.map(([name, value]) => ({
			name: name.length > 28 ? `${name.slice(0, 28)}…` : name,
			fullName: name,
			value,
		}));
}

function aggregateSikapEntries(entries: SikapEntry[]) {
	const base = {
		sikapData: new Map<string, number>(),
		kinerjaData: new Map<string, number>(),
		ekonomiData: new Map<string, number>(),
		temaData: new Map<string, number>(),
		transformasiData: new Map<string, number>(),
		subBidangData: new Map<string, number>(),
	};

	entries.forEach((entry) => {
		(Object.keys(base) as SikapGroupKey[]).forEach((groupKey) => {
			entry[groupKey].forEach((item) => {
				base[groupKey].set(item.kategori, (base[groupKey].get(item.kategori) ?? 0) + item.jumlah);
			});
		});
	});

	return (Object.keys(base) as SikapGroupKey[]).reduce<Record<SikapGroupKey, SikapItem[]>>((accumulator, groupKey) => {
		accumulator[groupKey] = Array.from(base[groupKey].entries()).map(([kategori, jumlah]) => ({ kategori, jumlah }));
		return accumulator;
	}, {
		sikapData: [],
		kinerjaData: [],
		ekonomiData: [],
		temaData: [],
		transformasiData: [],
		subBidangData: [],
	});
}

function aggregateSaran(payload: SaranApi, option: TrainingOption | null) {
	if (!option) {
		return { data: payload.data, ngram: payload.ngram };
	}

	const selected = payload.pelatihanData?.find((entry) => matchesTraining(option, entry.pelatihanId, entry.namaPelatihan));
	if (selected) {
		return { data: selected.data, ngram: selected.ngram };
	}

	return {
		data: {
			metode: [],
			materi: [],
			waktu: [],
			pengajar: [],
		},
		ngram: {
			metode: { bigram: {}, trigram: {} },
			materi: { bigram: {}, trigram: {} },
			waktu: { bigram: {}, trigram: {} },
			pengajar: { bigram: {}, trigram: {} },
		},
	};
}

function buildLikertRowsFromGrouped(
	grouped: Record<string, Array<{ pelatihanId: number | null; namaPelatihan: string | null; frekuensi: Record<string, number> }>>,
	option: TrainingOption | null,
) {
	return Object.entries(grouped)
		.map(([question, entries]) => {
			const merged = mergeRecords(
				entries.filter((entry) => matchesTraining(option, entry.pelatihanId, entry.namaPelatihan)).map((entry) => entry.frekuensi),
			);
			const total = sumRecord(merged);
			const positive = (merged[likertOrder[2]] ?? 0) + (merged[likertOrder[3]] ?? 0);

			return {
				question: question.length > 54 ? `${question.slice(0, 54)}…` : question,
				fullQuestion: question,
				total,
				positiveRate: total > 0 ? (positive / total) * 100 : 0,
				...likertOrder.reduce<Record<string, number>>((accumulator, label) => {
					accumulator[label] = merged[label] ?? 0;
					return accumulator;
				}, {}),
			} as LikertRow;
		})
		.filter((row) => row.total > 0);
}

function buildLikertRowsFromReview(
	entries: ReviewApi["data"],
	option: TrainingOption | null,
) {
	const selectedEntries = entries.filter((entry) => matchesTraining(option, entry.pelatihanId, entry.namaPelatihan));
	const questionMap = new Map<string, Record<string, number>>();

	selectedEntries.forEach((entry) => {
		Object.entries(entry.frekuensi).forEach(([question, frekuensi]) => {
			const existing = questionMap.get(question) ?? {};
			Object.entries(frekuensi).forEach(([label, value]) => {
				existing[label] = (existing[label] ?? 0) + value;
			});
			questionMap.set(question, existing);
		});
	});

	return Array.from(questionMap.entries()).map(([question, frekuensi]) => {
		const total = sumRecord(frekuensi);
		const positive = (frekuensi[likertOrder[2]] ?? 0) + (frekuensi[likertOrder[3]] ?? 0);

		return {
			question: question.length > 54 ? `${question.slice(0, 54)}…` : question,
			fullQuestion: question,
			total,
			positiveRate: total > 0 ? (positive / total) * 100 : 0,
			...likertOrder.reduce<Record<string, number>>((accumulator, label) => {
				accumulator[label] = frekuensi[label] ?? 0;
				return accumulator;
			}, {}),
		} as LikertRow;
	});
}

function buildLikertRowsFromWaktu(entries: WaktuApi["data"], option: TrainingOption | null) {
	const selectedEntries = entries.filter((entry) => matchesTraining(option, entry.pelatihanId, entry.namaPelatihan));

	return selectedEntries
		.map((entry) => {
			const total = sumRecord(entry.data);
			const positive = (entry.data[likertOrder[2]] ?? 0) + (entry.data[likertOrder[3]] ?? 0);

			return {
				question: safeName(entry.namaPelatihan).length > 54 ? `${safeName(entry.namaPelatihan).slice(0, 54)}…` : safeName(entry.namaPelatihan),
				fullQuestion: safeName(entry.namaPelatihan),
				total,
				positiveRate: total > 0 ? (positive / total) * 100 : 0,
				...likertOrder.reduce<Record<string, number>>((accumulator, label) => {
					accumulator[label] = entry.data[label] ?? 0;
					return accumulator;
				}, {}),
			} as LikertRow;
		})
		.filter((row) => row.total > 0);
}

function getPositiveSummary(label: string, rows: LikertRow[]) {
	const totalPositive = rows.reduce((total, row) => total + Number(row[likertOrder[2]]) + Number(row[likertOrder[3]]), 0);
	const totalResponses = rows.reduce((total, row) => total + row.total, 0);
	return {
		name: label,
		value: totalResponses > 0 ? Number(((totalPositive / totalResponses) * 100).toFixed(1)) : 0,
	};
}

function formatPercent(value: number) {
	return `${value.toFixed(1)}%`;
}

function buildWordCloud(items: string[], mode: ThemeMode, limit = 28): WordCloudItem[] {
	const accents = mode === "dark" ? wordCloudAccentsDark : wordCloudAccentsLight;
	const frequency = items.reduce<Record<string, number>>((accumulator, item) => {
		item
			.toLowerCase()
			.replace(/[^\p{L}\p{N}\s-]/gu, " ")
			.split(/\s+/)
			.map((token) => token.trim())
			.filter((token) => token.length >= 4 && !/^\d+$/.test(token) && !saranStopWords.has(token))
			.forEach((token) => {
				accumulator[token] = (accumulator[token] ?? 0) + 1;
			});
		return accumulator;
	}, {});

	const entries = Object.entries(frequency)
		.sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
		.slice(0, limit);

	if (entries.length === 0) {
		return [];
	}

	const maxValue = entries[0]?.[1] ?? 1;
	const minValue = entries[entries.length - 1]?.[1] ?? 1;
	const spread = Math.max(maxValue - minValue, 1);

	return entries.map(([text, value], index) => ({
		text,
		value,
		fontSize: 14 + ((value - minValue) / spread) * 18,
		accentClass: accents[index % accents.length],
		rotationClass: wordCloudRotations[index % wordCloudRotations.length],
	}));
}

function ChartTooltipContent({ active, payload, label, theme }: { active?: boolean; payload?: Array<{ color?: string; dataKey?: string; name?: string; value?: number; payload?: { name?: string; fullName?: string; fullQuestion?: string } }>; label?: string; theme: ThemeClasses }) {
	if (!active || !payload || payload.length === 0) {
		return null;
	}

	const fullLabel = payload[0]?.payload?.fullName ?? payload[0]?.payload?.fullQuestion ?? label;

	return (
		<div className={cn("rounded-2xl px-4 py-3 text-sm shadow-2xl backdrop-blur", theme.tooltipBox)}>
			<p className={cn("mb-2 max-w-xs", theme.tooltipTitle)}>{fullLabel}</p>
			<div className="space-y-1">
				{payload.map((entry) => (
					<div key={`${entry.dataKey}-${entry.color}`} className={cn("flex items-center justify-between gap-4", theme.tooltipRow)}>
						<div className="flex items-center gap-2">
							<span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color ?? "#fff" }} />
							<span>{entry.dataKey === "value" ? entry.name ?? entry.payload?.name ?? "Nilai" : entry.dataKey}</span>
						</div>
						<span className={cn("font-semibold", theme.tooltipValue)}>{entry.value ?? 0}</span>
					</div>
				))}
			</div>
		</div>
	);
}

function MetricCard({ title, value, description, icon: Icon, accent, theme }: { title: string; value: string; description: string; icon: typeof Sparkles; accent: string; theme: ThemeClasses }) {
	return (
		<div className={cn("rounded-3xl p-5 backdrop-blur-xl", theme.metricCard)}>
			<div className="mb-4 flex items-center justify-between">
				<div className={cn("rounded-2xl p-3 text-white shadow-lg", accent)}>
					<Icon className="h-5 w-5" />
				</div>
				<span className={cn("rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.22em]", theme.metricBadge)}>Live</span>
			</div>
			<div className="space-y-1">
				<p className={cn("text-sm", theme.metricTitle)}>{title}</p>
				<p className={cn("text-3xl font-semibold tracking-tight", theme.metricValue)}>{value}</p>
				<p className={cn("text-sm leading-relaxed", theme.metricDescription)}>{description}</p>
			</div>
		</div>
	);
}

function Panel({ title, subtitle, icon: Icon, children, action, theme }: { title: string; subtitle?: string; icon: typeof Sparkles; children: React.ReactNode; action?: React.ReactNode; theme: ThemeClasses }) {
	return (
		<section className={cn("rounded-[28px] p-5 backdrop-blur-xl sm:p-6", theme.panel)}>
			<div className={cn("mb-5 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-start sm:justify-between", theme.panelBorder)}>
				<div className="flex items-start gap-3">
					<div className={cn("rounded-2xl p-3", theme.panelIconWrap)}>
						<Icon className="h-5 w-5" />
					</div>
					<div>
						<h2 className={cn("text-lg font-semibold sm:text-xl", theme.panelTitle)}>{title}</h2>
						{subtitle ? <p className={cn("mt-1 max-w-2xl text-sm leading-relaxed", theme.panelSubtitle)}>{subtitle}</p> : null}
					</div>
				</div>
				{action}
			</div>
			{children}
		</section>
	);
}

export default function DashboardPage() {
	const [data, setData] = useState<DashboardData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [themeMode, setThemeMode] = useState<ThemeMode>("light");
	const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
	const [selectedTrainingKey, setSelectedTrainingKey] = useState("all");
	const [selectedSikapGroup, setSelectedSikapGroup] = useState<SikapGroupKey>("kinerjaData");
	const [selectedSaranCategory, setSelectedSaranCategory] = useState<SaranCategory | "semua">("semua");
	const [selectedNgramType, setSelectedNgramType] = useState<NgramType>("bigram");
	const theme = useMemo(() => getThemeClasses(themeMode), [themeMode]);
	const isDarkMode = themeMode === "dark";

	useEffect(() => {
		let cancelled = false;

		async function fetchAll() {
			setLoading(true);
			setError(null);
			try {
				const [materi, dukungan, sikap, waktu, saran, review] = await Promise.all([
					fetch("/api/materi").then(async (response) => {
						if (!response.ok) throw new Error("Gagal memuat data materi");
						return response.json() as Promise<MateriApi>;
					}),
					fetch("/api/dukungan").then(async (response) => {
						if (!response.ok) throw new Error("Gagal memuat data dukungan lingkungan");
						return response.json() as Promise<DukunganApi>;
					}),
					fetch("/api/sikap").then(async (response) => {
						if (!response.ok) throw new Error("Gagal memuat data perilaku dan kinerja");
						return response.json() as Promise<SikapApi>;
					}),
					fetch("/api/waktu").then(async (response) => {
						if (!response.ok) throw new Error("Gagal memuat data kesesuaian waktu");
						return response.json() as Promise<WaktuApi>;
					}),
					fetch("/api/saran").then(async (response) => {
						if (!response.ok) throw new Error("Gagal memuat data saran dan masukan");
						return response.json() as Promise<SaranApi>;
					}),
					fetch("/api/review").then(async (response) => {
						if (!response.ok) throw new Error("Gagal memuat data peer review");
						return response.json() as Promise<ReviewApi>;
					}),
				]);

				if (!cancelled) {
					setData({ materi, dukungan, sikap, waktu, saran, review });
				}
			} catch (fetchError) {
				if (!cancelled) {
					setError(fetchError instanceof Error ? fetchError.message : "Terjadi kesalahan saat memuat dashboard");
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		fetchAll();
		return () => {
			cancelled = true;
		};
	}, []);

	const trainingOptions = useMemo(() => {
		if (!data) return [] as TrainingOption[];

		const map = new Map<string, TrainingOption>();

		data.materi.result.forEach((entry) => addTrainingOption(map, entry.pelatihanId, entry.namaPelatihan));
		Object.entries(data.dukungan.frekuensi).forEach(([, entries]) => {
			entries.forEach((entry) => addTrainingOption(map, entry.pelatihanId, entry.namaPelatihan));
		});
		data.sikap.data.forEach((entry) => addTrainingOption(map, entry.pelatihanId, entry.namaPelatihan));
		data.waktu.data.forEach((entry) => addTrainingOption(map, entry.pelatihanId, entry.namaPelatihan));
		data.saran.pelatihanData?.forEach((entry) => addTrainingOption(map, entry.pelatihanId, entry.namaPelatihan));
		data.review.data.forEach((entry) => addTrainingOption(map, entry.pelatihanId, entry.namaPelatihan));

		return Array.from(map.values()).sort((first, second) => first.name.localeCompare(second.name));
	}, [data]);

	const selectedTraining = useMemo(() => {
		if (selectedTrainingKey === "all") return null;
		return trainingOptions.find((option) => option.key === selectedTrainingKey) ?? null;
	}, [selectedTrainingKey, trainingOptions]);

	const materiSummary = useMemo(() => {
		if (!data) return { relevan: [] as ChartDatum[], tidakRelevan: [] as ChartDatum[], total: 0 };

		const filteredRows = data.materi.result.filter((entry) => matchesTraining(selectedTraining, entry.pelatihanId, entry.namaPelatihan));
		const source = selectedTraining && selectedTraining.id !== null
			? data.materi.frekuensiPerPelatihan[String(selectedTraining.id)]
			: undefined;

		const relevan = source?.relevan ?? filteredRows.reduce<Record<string, number>>((accumulator, entry) => {
			Object.values(entry.relevan).filter(Boolean).forEach((value) => {
				accumulator[value] = (accumulator[value] ?? 0) + 1;
			});
			return accumulator;
		}, {});

		const tidakRelevan = source?.tidakRelevan ?? filteredRows.reduce<Record<string, number>>((accumulator, entry) => {
			Object.values(entry.tidakRelevan).filter(Boolean).forEach((value) => {
				accumulator[value] = (accumulator[value] ?? 0) + 1;
			});
			return accumulator;
		}, {});

		return {
			relevan: sortEntries(relevan, 7),
			tidakRelevan: sortEntries(tidakRelevan, 7),
			total: filteredRows.length,
		};
	}, [data, selectedTraining]);

	const dukunganRows = useMemo(() => {
		if (!data) return [] as LikertRow[];
		return buildLikertRowsFromGrouped(data.dukungan.frekuensi, selectedTraining);
	}, [data, selectedTraining]);

	const reviewRows = useMemo(() => {
		if (!data) return [] as LikertRow[];
		return buildLikertRowsFromReview(data.review.data, selectedTraining);
	}, [data, selectedTraining]);

	const waktuRows = useMemo(() => {
		if (!data) return [] as LikertRow[];
		return buildLikertRowsFromWaktu(data.waktu.data, selectedTraining);
	}, [data, selectedTraining]);

	const sikapAggregate = useMemo(() => {
		if (!data) {
			return {
				sikapData: [],
				kinerjaData: [],
				ekonomiData: [],
				temaData: [],
				transformasiData: [],
				subBidangData: [],
			} as Record<SikapGroupKey, SikapItem[]>;
		}

		const entries = data.sikap.data.filter((entry) => matchesTraining(selectedTraining, entry.pelatihanId, entry.namaPelatihan));
		return aggregateSikapEntries(entries);
	}, [data, selectedTraining]);

	const sikapChartData = useMemo(() => {
		return [...sikapAggregate[selectedSikapGroup]]
			.filter((item) => item.jumlah > 0)
			.sort((first, second) => second.jumlah - first.jumlah)
			.slice(0, 8)
			.map((item) => ({
				name: item.kategori.length > 30 ? `${item.kategori.slice(0, 30)}…` : item.kategori,
				fullName: item.kategori,
				value: item.jumlah,
			}));
	}, [selectedSikapGroup, sikapAggregate]);

	const saranAggregate = useMemo(() => {
		if (!data) {
			return {
				data: {
					metode: [],
					materi: [],
					waktu: [],
					pengajar: [],
				},
				ngram: {
					metode: { bigram: {}, trigram: {} },
					materi: { bigram: {}, trigram: {} },
					waktu: { bigram: {}, trigram: {} },
					pengajar: { bigram: {}, trigram: {} },
				},
			};
		}
		return aggregateSaran(data.saran, selectedTraining);
	}, [data, selectedTraining]);

	const saranCategoryCards = useMemo(() => {
		return (Object.keys(saranLabels) as SaranCategory[]).map((key) => ({
			key,
			label: saranLabels[key],
			value: saranAggregate.data[key].length,
		}));
	}, [saranAggregate]);

	const saranPhraseData = useMemo(() => {
		const categories = (Object.keys(saranLabels) as SaranCategory[]);

		if (selectedSaranCategory === "semua") {
			return sortEntries(
				mergeRecords(categories.map((category) => saranAggregate.ngram[category][selectedNgramType])),
				8,
			);
		}

		return sortEntries(saranAggregate.ngram[selectedSaranCategory][selectedNgramType], 8);
	}, [saranAggregate, selectedNgramType, selectedSaranCategory]);

	const saranSamples = useMemo(() => {
		const categories = (Object.keys(saranLabels) as SaranCategory[]);
		const items = selectedSaranCategory === "semua"
			? categories.flatMap((category) => saranAggregate.data[category])
			: saranAggregate.data[selectedSaranCategory];

		return items.filter(Boolean);
	}, [saranAggregate, selectedSaranCategory]);

	const saranWordCloud = useMemo(() => buildWordCloud(saranSamples, themeMode), [saranSamples, themeMode]);

	const positiveSummary = useMemo(() => {
		return [
			getPositiveSummary("Dukungan", dukunganRows),
			getPositiveSummary("Waktu", waktuRows),
			getPositiveSummary("Penilaian Rekan", reviewRows),
		];
	}, [dukunganRows, reviewRows, waktuRows]);

	const reviewerCount = useMemo(() => {
		return reviewRows.reduce((highest, row) => Math.max(highest, row.total), 0);
	}, [reviewRows]);

	const insightCards = useMemo(() => {
		const topRelevan = materiSummary.relevan[0]?.fullName ?? "Belum ada data";
		const topIssue = materiSummary.tidakRelevan[0]?.fullName ?? "Belum ada data";
		const bestDukungan = [...dukunganRows].sort((first, second) => second.positiveRate - first.positiveRate)[0];
		const bestReview = [...reviewRows].sort((first, second) => second.positiveRate - first.positiveRate)[0];
		const topSaran = saranPhraseData[0]?.fullName ?? "Belum ada pola dominan";

		return [
			{
				title: "Materi paling relevan",
				value: topRelevan,
				detail: `${materiSummary.total} respons materi dalam filter aktif`,
			},
			{
				title: "Prioritas perbaikan materi",
				value: topIssue,
				detail: "Topik yang paling sering muncul sebagai kurang relevan",
			},
			{
				title: "Dukungan terkuat",
				value: bestDukungan?.fullQuestion ?? "Belum ada data",
				detail: bestDukungan ? `${formatPercent(bestDukungan.positiveRate)} respon positif` : "Belum ada data dukungan",
			},
			{
				title: "Tema saran dominan",
				value: topSaran,
				detail: `Diambil dari ${selectedNgramType === "bigram" ? "frasa 2 kata" : "frasa 3 kata"}`,
			},
			{
				title: "Penilaian Rekan terbaik",
				value: bestReview?.fullQuestion ?? "Belum ada data",
				detail: bestReview ? `${formatPercent(bestReview.positiveRate)} respon positif` : "Belum ada data review",
			},
		];
	}, [dukunganRows, materiSummary, reviewRows, saranPhraseData, selectedNgramType]);

	const overviewPieData = useMemo(() => {
		const positive = positiveSummary.reduce((total, item) => total + item.value, 0);
		const negative = positiveSummary.length * 100 - positive;
		return [
			{ name: "Positif", value: Number(positive.toFixed(1)) },
			{ name: "Non-positif", value: Number(Math.max(negative, 0).toFixed(1)) },
		];
	}, [positiveSummary]);

	if (loading) {
		return (
			<div className={cn("min-h-screen px-4 py-6 sm:px-6 lg:px-8", theme.loadingBg, theme.baseText)}>
				<div className="mx-auto flex min-h-[88vh] max-w-7xl items-center justify-center">
					<div className={cn("w-full max-w-xl rounded-[32px] p-8 text-center shadow-2xl backdrop-blur-xl", theme.heroCard)}>
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
							<RefreshCcw className="h-7 w-7 animate-spin" />
						</div>
						<h1 className={cn("text-2xl font-semibold", theme.textPrimary)}>Memuat dashboard evaluasi</h1>
						<p className={cn("mt-3 text-sm leading-relaxed", theme.textMuted)}>Mengambil rangkuman dari seluruh modul admin agar siap ditampilkan dalam satu layar interaktif.</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className={cn("min-h-screen px-4 py-6 sm:px-6 lg:px-8", theme.errorBg, theme.baseText)}>
				<div className="mx-auto flex min-h-[88vh] max-w-4xl items-center justify-center">
					<div className="w-full rounded-[32px] border border-rose-400/20 bg-rose-500/10 p-8 text-center shadow-2xl backdrop-blur-xl">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 text-rose-200">
							<ShieldCheck className="h-7 w-7" />
						</div>
						<h1 className={cn("text-2xl font-semibold", theme.textPrimary)}>Dashboard belum bisa dimuat</h1>
						<p className={cn("mt-3 text-sm leading-relaxed", theme.textSecondary)}>{error ?? "Data tidak tersedia."}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("min-h-screen overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8", theme.pageBg, theme.baseText)}>
			<div className="mx-auto flex max-w-[1800px] flex-col gap-6">
				<section className={cn("overflow-hidden rounded-[32px] p-5 backdrop-blur-xl sm:p-7", theme.heroCard)}>
					<div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
						<div className="max-w-4xl">
							<div className={cn("mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.24em]", theme.heroBadge, theme.heroBadgeText)}>
								<Sparkles className="h-3.5 w-3.5" />
								Dashboard Evaluasi Terintegrasi
							</div>
							<h1 className={cn("text-3xl font-semibold tracking-tight sm:text-4xl xl:text-[44px]", theme.textPrimary)}>Evaluasi Pasca Pelatihan Nasional</h1>
							<p className={cn("mt-4 max-w-3xl text-sm leading-7 sm:text-base", theme.textMuted)}>
								Evaluasi Pasca Pelatihan (EPP) Nasional dilakukan untuk mengukur dampak pelatihan ASN terhadap peningkatan kapasitas kepemimpinan, kinerja individu, dan kontribusi organisasi dalam mendukung agenda Pembangunan SDM menuju Indonesia Emas 2045. Evaluasi ini melibatkan 2.493 responden dari 168 instansi. Penilaian difokuskan pada relevansi materi, dukungan lingkungan kerja, perubahan perilaku dan kinerja, serta keberlanjutan hasil pelatihan, menggunakan metode survei, FGD, dan wawancara.
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-2 xl:min-w-[420px]">
							<div className="flex items-start justify-end sm:col-span-2">
								<button
									type="button"
									onClick={() => setThemeMode(isDarkMode ? "light" : "dark")}
									className={cn("inline-flex items-center gap-3 rounded-full border px-3 py-2 text-sm font-medium transition", theme.toggleButton)}
								>
									<span className={cn("flex h-9 w-9 items-center justify-center rounded-full", theme.toggleThumb)}>
										{isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
									</span>
									<div className="text-left leading-tight">
										<p className={cn("text-xs uppercase tracking-[0.2em]", theme.textSoft)}>Mode Tampilan</p>
										<p className={cn("text-sm font-semibold", theme.textPrimary)}>{isDarkMode ? "Dark mode" : "Light mode"}</p>
									</div>
								</button>
							</div>
							<div className={cn("rounded-3xl p-4", theme.heroStatsCard)}>
								<p className={cn("text-xs uppercase tracking-[0.22em]", theme.textSoft)}>Filter aktif</p>
								<p className={cn("mt-2 text-lg font-semibold", theme.textPrimary)}>{selectedTraining?.name ?? "Semua Pelatihan"}</p>
								<p className={cn("mt-1 text-sm", theme.textMuted)}>{trainingOptions.length} program tercakup</p>
							</div>
							<div className={cn("rounded-3xl p-4", theme.heroStatsCard)}>
								<p className={cn("text-xs uppercase tracking-[0.22em]", theme.textSoft)}>Tab aktif</p>
								<p className={cn("mt-2 text-lg font-semibold", theme.textPrimary)}>{tabs.find((tab) => tab.key === activeTab)?.label}</p>
								<p className={cn("mt-1 text-sm", theme.textMuted)}>Navigasi cepat antar insight</p>
							</div>
						</div>
					</div>

					<div className="mt-6 space-y-4">
						<div className={cn("rounded-[28px] p-4 sm:p-5", theme.filterCard)}>
							<div className={cn("mb-3 flex items-center gap-2 text-sm", theme.filterLabel)}>
								<Filter className="h-4 w-4 text-cyan-300" />
								Filter utama dashboard
							</div>
							<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
								<label className="block">
									<span className={cn("mb-2 block text-sm", theme.textMuted)}>Pilih pelatihan</span>
									<div className="relative">
										<select
											value={selectedTrainingKey}
											onChange={(event) => setSelectedTrainingKey(event.target.value)}
											className={cn("w-full appearance-none rounded-2xl px-4 py-3 pr-12 text-sm outline-none ring-0 transition", theme.input)}
										>
											<option value="all" className="text-slate-900">Semua Pelatihan</option>
											{trainingOptions.map((option) => (
												<option key={option.key} value={option.key} className="text-slate-900">
													{option.name}
												</option>
											))}
										</select>
										<span className={cn("pointer-events-none absolute inset-y-0 right-4 flex items-center", theme.textSoft)}>
											<ChevronRight className="h-4 w-4 rotate-90" />
										</span>
									</div>
								</label>
								<button
									type="button"
									onClick={() => {
										setSelectedTrainingKey("all");
										setActiveTab("overview");
									}}
									className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-medium transition", theme.resetButton)}
								>
									<RefreshCcw className="h-4 w-4" />
									Reset filter
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
							<MetricCard title="Modul Analitik" value="6" description="Semua modul terkonsolidasi" icon={Layers3} accent="bg-gradient-to-br from-cyan-500 to-blue-500" theme={theme} />
							<MetricCard title="Pelatihan" value={String(trainingOptions.length)} description="Program yang bisa difilter secara instan." icon={BookOpen} accent="bg-gradient-to-br from-indigo-500 to-violet-500" theme={theme} />
							<MetricCard title="Respons" value={String(materiSummary.total)} description="Jumlah alumni yang mengisi survei" icon={Activity} accent="bg-gradient-to-br from-emerald-500 to-teal-500" theme={theme} />
							<MetricCard title="Rekan Kerja Penilai" value={String(reviewerCount)} description="Jumlah atasan/rekan alumni mengisi survei" icon={Users} accent="bg-gradient-to-br from-amber-500 to-orange-500" theme={theme} />
						</div>
					</div>
				</section>

				<section className={cn("overflow-x-auto rounded-[28px] p-2 backdrop-blur-xl", theme.tabBar)}>
					<div className="flex min-w-max gap-2">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.key}
									type="button"
									onClick={() => setActiveTab(tab.key)}
									className={cn(
										"inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition",
										activeTab === tab.key ? theme.tabActive : theme.tabInactive,
									)}
								>
									<Icon className="h-4 w-4" />
									{tab.label}
								</button>
							);
						})}
					</div>
				</section>

				{activeTab === "overview" ? (
					<div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
						<div className="space-y-6">
							<Panel title="Sorotan utama" subtitle="Kartu insight cepat untuk membantu membaca pola dominan pada filter aktif." icon={Sparkles} theme={theme}>
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									{insightCards.map((card) => (
										<div key={card.title} className={cn("rounded-3xl p-4", theme.surfaceCard)}>
											<p className={cn("text-xs uppercase tracking-[0.18em]", isDarkMode ? "text-cyan-200/70" : "text-cyan-700")}>{card.title}</p>
											<p className={cn("mt-3 min-h-[72px] text-lg font-semibold leading-tight", theme.textPrimary)}>{card.value}</p>
											<div className={cn("mt-4 flex items-center gap-2 text-sm", theme.textSoft)}>
												<ChevronRight className="h-4 w-4 text-cyan-300" />
												{card.detail}
											</div>
										</div>
									))}
								</div>
							</Panel>

							<Panel title="Top materi" subtitle="Perbandingan tema materi yang paling relevan dan paling perlu perhatian." icon={BookOpen} theme={theme}>
								<div className="grid gap-5 lg:grid-cols-2">
									<div className="rounded-3xl border border-emerald-400/15 bg-emerald-500/8 p-4">
										<div className="mb-4 flex items-center justify-between">
											<h3 className={cn("text-sm font-semibold", isDarkMode ? "text-emerald-200" : "text-emerald-700")}>Paling relevan</h3>
											<span className={cn("rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs", isDarkMode ? "text-emerald-100" : "text-emerald-700")}>Top 7</span>
										</div>
										<div className="h-[320px]">
											<ResponsiveContainer width="100%" height="100%">
												<BarChart data={materiSummary.relevan} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
													<CartesianGrid horizontal={false} stroke={theme.chartGrid} />
													<XAxis type="number" allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
													<YAxis type="category" dataKey="name" width={120} tick={{ fill: theme.axisTickStrong, fontSize: 11 }} axisLine={false} tickLine={false} />
													<Tooltip content={<ChartTooltipContent theme={theme} />} cursor={{ fill: theme.chartCursor }} />
													<Bar dataKey="value" radius={[0, 14, 14, 0]} fill="#10b981" />
												</BarChart>
											</ResponsiveContainer>
										</div>
									</div>

									<div className="rounded-3xl border border-rose-400/15 bg-rose-500/8 p-4">
										<div className="mb-4 flex items-center justify-between">
											<h3 className={cn("text-sm font-semibold", isDarkMode ? "text-rose-200" : "text-rose-700")}>Kurang relevan</h3>
											<span className={cn("rounded-full bg-rose-400/10 px-2.5 py-1 text-xs", isDarkMode ? "text-rose-100" : "text-rose-700")}>Top 7</span>
										</div>
										<div className="h-[320px]">
											<ResponsiveContainer width="100%" height="100%">
												<BarChart data={materiSummary.tidakRelevan} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
													<CartesianGrid horizontal={false} stroke={theme.chartGrid} />
													<XAxis type="number" allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
													<YAxis type="category" dataKey="name" width={120} tick={{ fill: theme.axisTickStrong, fontSize: 11 }} axisLine={false} tickLine={false} />
													<Tooltip content={<ChartTooltipContent theme={theme} />} cursor={{ fill: theme.chartCursor }} />
													<Bar dataKey="value" radius={[0, 14, 14, 0]} fill="#fb7185" />
												</BarChart>
											</ResponsiveContainer>
										</div>
									</div>
								</div>
							</Panel>
						</div>

						<div className="space-y-6">
							<Panel title="Komposisi persepsi positif" subtitle="Rata-rata proporsi respons positif pada tiga modul kuantitatif utama." icon={ShieldCheck} theme={theme}>
								<div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
									<div className={cn("rounded-3xl p-3", theme.surfaceCard)}>
										<div className="h-[220px]">
											<ResponsiveContainer width="100%" height="100%">
												<PieChart>
													<Pie data={overviewPieData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={92} paddingAngle={5}>
														{overviewPieData.map((entry, index) => (
															<Cell key={entry.name} fill={index === 0 ? "#22c55e" : theme.pieRest} />
														))}
													</Pie>
													<Tooltip content={<ChartTooltipContent theme={theme} />} />
												</PieChart>
											</ResponsiveContainer>
										</div>
										<div className="mt-3 grid gap-2">
											{overviewPieData.map((item, index) => (
												<div key={item.name} className="flex items-center justify-between gap-3 rounded-2xl border border-transparent px-2 py-1.5">
													<div className="flex items-center gap-2">
														<span className="h-3 w-3 rounded-full" style={{ backgroundColor: index === 0 ? "#22c55e" : theme.pieRest }} />
														<span className={cn("text-sm font-medium", theme.textSecondary)}>{item.name}</span>
													</div>
													<span className={cn("text-sm font-semibold", theme.textPrimary)}>{item.value}%</span>
												</div>
											))}
										</div>
									</div>
									<div className="grid gap-3">
										{positiveSummary.map((item, index) => (
											<div key={item.name} className={cn("rounded-3xl p-4", theme.surfaceCard)}>
												<div className="flex items-center justify-between">
													<p className={cn("text-sm", theme.textMuted)}>{item.name}</p>
													<p className={cn("text-lg font-semibold", theme.textPrimary)}>{formatPercent(item.value)}</p>
												</div>
												<div className={cn("mt-3 h-2.5 rounded-full", isDarkMode ? "bg-white/10" : "bg-slate-200") }>
													<div
														className={cn(
															"h-2.5 rounded-full",
															index === 0 ? "bg-gradient-to-r from-sky-400 to-cyan-400" : index === 1 ? "bg-gradient-to-r from-violet-400 to-indigo-400" : "bg-gradient-to-r from-emerald-400 to-lime-400",
														)}
														style={{ width: `${Math.min(item.value, 100)}%` }}
													/>
												</div>
											</div>
										))}
									</div>
								</div>
							</Panel>

							<Panel title="Perubahan perilaku dominan" subtitle={`Grup saat ini: ${sikapGroupMeta[selectedSikapGroup].label}`} icon={Brain} theme={theme} action={
								<div className="flex flex-wrap gap-2">
									{(Object.keys(sikapGroupMeta) as SikapGroupKey[]).map((groupKey) => (
										<button
											key={groupKey}
											type="button"
											onClick={() => setSelectedSikapGroup(groupKey)}
											className={cn(
												"rounded-full px-3 py-1.5 text-xs font-medium transition",
												getChipClass(selectedSikapGroup === groupKey, themeMode),
											)}
										>
											{sikapGroupMeta[groupKey].label}
										</button>
									))}
								</div>
							}>
								<div className={cn("rounded-3xl border border-white/10 bg-gradient-to-br p-4", sikapGroupMeta[selectedSikapGroup].tone)}>
									<div className="h-[340px]">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={sikapChartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
												<CartesianGrid horizontal={false} stroke={theme.chartGrid} />
												<XAxis type="number" allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
												<YAxis type="category" dataKey="name" width={150} tick={{ fill: theme.axisTickStrong, fontSize: 11 }} axisLine={false} tickLine={false} />
												<Tooltip content={<ChartTooltipContent theme={theme} />} cursor={{ fill: theme.chartCursor }} />
												<Bar dataKey="value" radius={[0, 14, 14, 0]} fill="#8b5cf6" />
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>
							</Panel>
						</div>
					</div>
				) : null}

				{activeTab === "materi" ? (
					<Panel title="Relevansi materi pelatihan" subtitle="Melihat tema pembelajaran yang paling mendukung kinerja dan topik yang perlu disesuaikan ulang." icon={BookOpen} theme={theme}>
						<div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
							<div className="grid gap-4">
								<div className="rounded-3xl border border-emerald-400/15 bg-emerald-500/10 p-5">
									<p className={cn("text-sm", isDarkMode ? "text-emerald-100/75" : "text-emerald-700")}>Top materi relevan</p>
									<p className={cn("mt-2 text-2xl font-semibold", theme.textPrimary)}>{materiSummary.relevan[0]?.fullName ?? "Belum ada data"}</p>
									<p className={cn("mt-2 text-sm", theme.textMuted)}>Kemunculan: {materiSummary.relevan[0]?.value ?? 0} kali</p>
								</div>
								<div className="rounded-3xl border border-rose-400/15 bg-rose-500/10 p-5">
									<p className={cn("text-sm", isDarkMode ? "text-rose-100/75" : "text-rose-700")}>Top materi kurang relevan</p>
									<p className={cn("mt-2 text-2xl font-semibold", theme.textPrimary)}>{materiSummary.tidakRelevan[0]?.fullName ?? "Belum ada data"}</p>
									<p className={cn("mt-2 text-sm", theme.textMuted)}>Kemunculan: {materiSummary.tidakRelevan[0]?.value ?? 0} kali</p>
								</div>
								<div className={cn("rounded-3xl p-5", theme.surfaceCard)}>
									<p className={cn("text-sm", theme.textMuted)}>Jumlah respons</p>
									<p className={cn("mt-2 text-3xl font-semibold", theme.textPrimary)}>{materiSummary.total}</p>
									<p className={cn("mt-2 text-sm", theme.textMuted)}>Respons yang masuk ke analisis materi untuk filter aktif.</p>
								</div>
							</div>
							<div className="grid gap-5 lg:grid-cols-2">
								<div className={cn("rounded-3xl p-4", theme.surfaceCard)}>
									<h3 className={cn("mb-4 text-sm font-semibold", isDarkMode ? "text-emerald-200" : "text-emerald-700")}>Sebaran materi relevan</h3>
									<div className="h-[380px]">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={materiSummary.relevan} margin={{ top: 10, right: 10, left: 0, bottom: 56 }}>
												<CartesianGrid stroke={theme.chartGrid} vertical={false} />
												<XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={80} tick={{ fill: theme.axisTick, fontSize: 10 }} axisLine={false} tickLine={false} />
												<YAxis allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
												<Tooltip content={<ChartTooltipContent theme={theme} />} />
												<Bar dataKey="value" fill="#10b981" radius={[14, 14, 0, 0]} />
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>
								<div className={cn("rounded-3xl p-4", theme.surfaceCard)}>
									<h3 className={cn("mb-4 text-sm font-semibold", isDarkMode ? "text-rose-200" : "text-rose-700")}>Sebaran materi kurang relevan</h3>
									<div className="h-[380px]">
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={materiSummary.tidakRelevan} margin={{ top: 10, right: 10, left: 0, bottom: 56 }}>
												<CartesianGrid stroke={theme.chartGrid} vertical={false} />
												<XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={80} tick={{ fill: theme.axisTick, fontSize: 10 }} axisLine={false} tickLine={false} />
												<YAxis allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
												<Tooltip content={<ChartTooltipContent theme={theme} />} />
												<Bar dataKey="value" fill="#fb7185" radius={[14, 14, 0, 0]} />
											</BarChart>
										</ResponsiveContainer>
									</div>
								</div>
							</div>
						</div>
					</Panel>
				) : null}

				{activeTab === "dukungan" ? (
					<Panel title="Dukungan lingkungan kerja" subtitle="Memantau bagaimana atasan dan rekan kerja mendukung penerapan hasil pelatihan." icon={Users} theme={theme}>
						<div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
							<div className={cn("rounded-3xl p-4", theme.surfaceCard)}>
								<div className="h-[440px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={dukunganRows} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
											<CartesianGrid horizontal={false} stroke={theme.chartGrid} />
											<XAxis type="number" allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
											<YAxis type="category" dataKey="question" width={190} tick={{ fill: theme.axisTickStrong, fontSize: 11 }} axisLine={false} tickLine={false} />
											<Tooltip content={<ChartTooltipContent theme={theme} />} />
											{likertOrder.map((label) => (
												<Bar key={label} dataKey={label} stackId="dukungan" radius={label === likertOrder[3] ? [0, 14, 14, 0] : [0, 0, 0, 0]} fill={likertColors[label]} />
											))}
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
							<div className="grid gap-4">
								{dukunganRows.map((row) => (
									<div key={row.fullQuestion} className={cn("rounded-3xl p-4", theme.surfaceCard)}>
										<div className="flex items-start justify-between gap-4">
											<div>
												<p className={cn("text-sm font-medium", theme.textPrimary)}>{row.fullQuestion}</p>
												<p className={cn("mt-1 text-xs", theme.textSoft)}>Total respons: {row.total}</p>
											</div>
											<span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">{formatPercent(row.positiveRate)}</span>
										</div>
										<div className={cn("mt-4 h-2.5 rounded-full", isDarkMode ? "bg-white/10" : "bg-slate-200") }>
											<div className="h-2.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" style={{ width: `${row.positiveRate}%` }} />
										</div>
									</div>
								))}
							</div>
						</div>
					</Panel>
				) : null}

				{activeTab === "sikap" ? (
					<Panel title="Perubahan perilaku dan peningkatan kinerja" subtitle="Mengelompokkan dampak pelatihan ke dalam kategori tematik agar cepat dibaca." icon={Brain} theme={theme} action={
						<div className="flex flex-wrap gap-2">
							{(Object.keys(sikapGroupMeta) as SikapGroupKey[]).map((groupKey) => (
								<button
									key={groupKey}
									type="button"
									onClick={() => setSelectedSikapGroup(groupKey)}
									className={cn(
										"rounded-full px-3 py-1.5 text-xs font-medium transition",
										getChipClass(selectedSikapGroup === groupKey, themeMode),
									)}
								>
									{sikapGroupMeta[groupKey].label}
								</button>
							))}
						</div>
					}>
						<div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
							<div className={cn("rounded-3xl border border-white/10 bg-gradient-to-br p-4", sikapGroupMeta[selectedSikapGroup].tone)}>
								<div className="h-[440px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={sikapChartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
												<CartesianGrid horizontal={false} stroke={theme.chartGrid} />
												<XAxis type="number" allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
												<YAxis type="category" dataKey="name" width={200} tick={{ fill: theme.axisTickStrong, fontSize: 11 }} axisLine={false} tickLine={false} />
												<Tooltip content={<ChartTooltipContent theme={theme} />} cursor={{ fill: theme.chartCursor }} />
											<Bar dataKey="value" fill="#8b5cf6" radius={[0, 14, 14, 0]} />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
							<div className="space-y-4">
								{sikapChartData.slice(0, 5).map((item, index) => (
									<div key={item.fullName} className={cn("rounded-3xl p-4", theme.surfaceCard)}>
										<div className="flex items-center justify-between gap-4">
											<div className="flex items-center gap-3">
												<div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold", isDarkMode ? "bg-white/10 text-white" : "bg-slate-100 text-slate-900")}>{index + 1}</div>
												<div>
													<p className={cn("text-sm font-medium", theme.textPrimary)}>{item.fullName}</p>
													<p className={cn("text-xs", theme.textSoft)}>Kategori {sikapGroupMeta[selectedSikapGroup].label}</p>
												</div>
											</div>
											<span className={cn("text-xl font-semibold", theme.textPrimary)}>{item.value}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</Panel>
				) : null}

				{activeTab === "waktu" ? (
					<Panel title="Kesesuaian waktu dan manfaat" subtitle="Membandingkan persepsi alumni atas manfaat pelatihan terhadap waktu yang dikeluarkan." icon={CalendarClock} theme={theme}>
						<div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
							<div className={cn("rounded-3xl p-4", theme.surfaceCard)}>
								<div className="h-[440px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={waktuRows} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
											<CartesianGrid horizontal={false} stroke={theme.chartGrid} />
											<XAxis type="number" allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
											<YAxis type="category" dataKey="question" width={190} tick={{ fill: theme.axisTickStrong, fontSize: 11 }} axisLine={false} tickLine={false} />
											<Tooltip content={<ChartTooltipContent theme={theme} />} />
											{likertOrder.map((label) => (
												<Bar key={label} dataKey={label} stackId="waktu" radius={label === likertOrder[3] ? [0, 14, 14, 0] : [0, 0, 0, 0]} fill={likertColors[label]} />
											))}
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
							<div className={cn("rounded-3xl p-5", theme.surfaceCard)}>
								<h3 className={cn("mb-4 text-sm font-semibold", theme.textSecondary)}>Skor positif per pelatihan</h3>
								<div className="space-y-4">
									{waktuRows.map((row) => (
										<div key={row.fullQuestion} className={cn("rounded-3xl p-4", theme.surfaceStrong)}>
											<div className="mb-3 flex items-center justify-between gap-3">
												<p className={cn("text-sm font-medium", theme.textPrimary)}>{row.fullQuestion}</p>
												<span className={cn("text-sm font-semibold", isDarkMode ? "text-cyan-200" : "text-cyan-700")}>{formatPercent(row.positiveRate)}</span>
											</div>
											<div className={cn("h-2.5 rounded-full", isDarkMode ? "bg-white/10" : "bg-slate-200") }>
												<div className="h-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400" style={{ width: `${row.positiveRate}%` }} />
											</div>
											<p className={cn("mt-2 text-xs", theme.textSoft)}>Total respons: {row.total}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</Panel>
				) : null}

				{activeTab === "saran" ? (
					<Panel title="Saran dan masukan" subtitle="Memadukan volume masukan, pola frasa dominan, dan peta kata dari masukan aktual agar cepat ditindaklanjuti." icon={MessageSquareText} theme={theme} action={
						<div className="flex flex-wrap gap-2">
							<button
								type="button"
								onClick={() => setSelectedSaranCategory("semua")}
								className={cn(
									"rounded-full px-3 py-1.5 text-xs font-medium transition",
									getChipClass(selectedSaranCategory === "semua", themeMode),
								)}
							>
								Semua
							</button>
							{(Object.keys(saranLabels) as SaranCategory[]).map((category) => (
								<button
									key={category}
									type="button"
									onClick={() => setSelectedSaranCategory(category)}
									className={cn(
										"rounded-full px-3 py-1.5 text-xs font-medium transition",
										getChipClass(selectedSaranCategory === category, themeMode),
									)}
								>
									{saranLabels[category]}
								</button>
							))}
							<button
								type="button"
								onClick={() => setSelectedNgramType(selectedNgramType === "bigram" ? "trigram" : "bigram")}
								className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition", getAccentChipClass(themeMode))}
							>
								{selectedNgramType === "bigram" ? "Frasa 2 kata" : "Frasa 3 kata"}
							</button>
						</div>
					}>
						<div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
							<div className="space-y-5">
								<div className="grid gap-3 sm:grid-cols-2">
									{saranCategoryCards.map((card) => (
										<div key={card.key} className={cn("rounded-3xl p-4", theme.surfaceCard)}>
											<p className={cn("text-sm", theme.textMuted)}>{card.label}</p>
											<p className={cn("mt-2 text-3xl font-semibold", theme.textPrimary)}>{card.value}</p>
											<p className={cn("mt-1 text-xs", theme.textSoft)}>Jumlah masukan unik</p>
										</div>
									))}
								</div>
								<div className={cn("rounded-3xl p-4", theme.surfaceCard)}>
									<div className="mb-4 flex items-start justify-between gap-4">
										<div>
											<h3 className={cn("text-sm font-semibold", theme.textSecondary)}>Word cloud masukan</h3>
											<p className={cn("mt-1 text-xs", theme.textSoft)}>Semakin besar kata, semakin sering muncul di masukan aktual.</p>
										</div>
										<span className={cn("rounded-full px-3 py-1 text-xs", theme.surfaceStrong, theme.textSecondary)}>{saranSamples.length} masukan</span>
									</div>
									<div className={cn("flex min-h-[280px] flex-wrap items-center justify-center gap-3 rounded-[28px] p-4", theme.surfaceStrong)}>
										{saranWordCloud.map((item) => (
											<div
												key={item.text}
												className={cn(
													"inline-flex items-center rounded-full border px-3 py-2 font-semibold tracking-tight transition-transform hover:scale-105",
													item.accentClass,
													item.rotationClass,
												)}
												style={{ fontSize: `${item.fontSize}px`, lineHeight: 1.1 }}
												title={`${item.text} • ${item.value} kemunculan`}
											>
												{item.text}
											</div>
										))}
										{saranWordCloud.length === 0 ? <p className={cn("text-sm", theme.textSoft)}>Belum ada saran pada filter ini.</p> : null}
									</div>
								</div>
							</div>
							<div className={cn("rounded-3xl p-4", theme.surfaceCard)}>
								<div className="mb-4 flex items-center justify-between gap-4">
									<div>
										<h3 className={cn("text-sm font-semibold", theme.textSecondary)}>Frasa dominan</h3>
										<p className={cn("mt-1 text-xs", theme.textSoft)}>{selectedSaranCategory === "semua" ? "Gabungan seluruh kategori" : `Kategori ${saranLabels[selectedSaranCategory]}`}</p>
									</div>
									<span className={cn("rounded-full bg-cyan-400/10 px-3 py-1 text-xs", isDarkMode ? "text-cyan-100" : "text-cyan-700")}>{selectedNgramType === "bigram" ? "2 kata" : "3 kata"}</span>
								</div>
								<div className="h-[420px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={saranPhraseData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
											<CartesianGrid horizontal={false} stroke={theme.chartGrid} />
											<XAxis type="number" allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
											<YAxis type="category" dataKey="name" width={145} tick={{ fill: theme.axisTickStrong, fontSize: 11 }} axisLine={false} tickLine={false} />
											<Tooltip content={<ChartTooltipContent theme={theme} />} cursor={{ fill: theme.chartCursor }} />
											<Bar dataKey="value" fill="#06b6d4" radius={[0, 14, 14, 0]} />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
						</div>
					</Panel>
				) : null}

				{activeTab === "review" ? (
					<Panel title="Penilaian rekan kerja" subtitle="Menangkap persepsi atasan dan rekan kerja terhadap dampak pelatihan pada alumni." icon={Star} theme={theme}>
						<div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
							<div className={cn("rounded-3xl p-4", theme.surfaceCard)}>
								<div className="h-[440px]">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={reviewRows} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
											<CartesianGrid horizontal={false} stroke={theme.chartGrid} />
											<XAxis type="number" allowDecimals={false} tick={{ fill: theme.axisTick, fontSize: 11 }} axisLine={false} tickLine={false} />
											<YAxis type="category" dataKey="question" width={190} tick={{ fill: theme.axisTickStrong, fontSize: 11 }} axisLine={false} tickLine={false} />
											<Tooltip content={<ChartTooltipContent theme={theme} />} />
											{likertOrder.map((label) => (
												<Bar key={label} dataKey={label} stackId="review" radius={label === likertOrder[3] ? [0, 14, 14, 0] : [0, 0, 0, 0]} fill={likertColors[label]} />
											))}
										</BarChart>
									</ResponsiveContainer>
								</div>
							</div>
							<div className="space-y-4">
								{reviewRows.map((row) => (
									<div key={row.fullQuestion} className={cn("rounded-3xl p-4", theme.surfaceCard)}>
										<div className="flex items-start justify-between gap-4">
											<div>
												<p className={cn("text-sm font-medium", theme.textPrimary)}>{row.fullQuestion}</p>
												<p className={cn("mt-1 text-xs", theme.textSoft)}>Total respons: {row.total}</p>
											</div>
											<span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-semibold text-emerald-200">{formatPercent(row.positiveRate)}</span>
										</div>
										<div className={cn("mt-4 h-2.5 rounded-full", isDarkMode ? "bg-white/10" : "bg-slate-200") }>
											<div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400" style={{ width: `${row.positiveRate}%` }} />
										</div>
									</div>
								))}
							</div>
						</div>
					</Panel>
				) : null}
			</div>
		</div>
	);
}
