<script setup>
import { computed, onMounted, ref } from "vue";
import { useData, withBase } from "vitepress";

const { lang } = useData();
const l = computed(() => (String(lang.value).toLowerCase().startsWith("ru") ? "ru" : "en"));

const t = computed(() =>
	l.value === "ru"
		? {
				modePackage: "По пакету",
				modePaste: "Вставить вывод CLI",
				pkg: "Пакет",
				current: "Текущая версия (необязательно)",
				currentPh: "напр. 0.9.0",
				pasteHint: "Вставьте вывод `gramio-detect-versions --latest --json` сюда",
				buildPlan: "Построить план",
				noUpgrades: "Обновлений не найдено — всё на последних версиях 🎉",
				nothing: "Для этого пакета нет записей о миграции.",
				changelog: "changelog",
				straight: "обновляйтесь сразу до",
				pending: "Помечено тегом, но ещё не в npm.",
				before: "Было",
				after: "Стало",
				planFor: "План обновления для вашего проекта",
				bumpOrder: "Бампайте в этом порядке (зависимости сверху вниз):",
				parseError: "Не удалось разобрать JSON. Убедитесь, что вставили вывод с флагом --json.",
				loadError: "Не удалось загрузить данные миграций.",
			}
		: {
				modePackage: "By package",
				modePaste: "Paste CLI output",
				pkg: "Package",
				current: "Current version (optional)",
				currentPh: "e.g. 0.9.0",
				pasteHint: "Paste the output of `gramio-detect-versions --latest --json` here",
				buildPlan: "Build plan",
				noUpgrades: "No upgrades found — everything is on the latest versions 🎉",
				nothing: "No migration entries for this package.",
				changelog: "changelog",
				straight: "upgrade straight to",
				pending: "Tagged but not yet on npm.",
				before: "Before",
				after: "After",
				planFor: "Upgrade plan for your project",
				bumpOrder: "Bump in this order (dependencies top-down):",
				parseError: "Couldn't parse JSON. Make sure you pasted the --json output.",
				loadError: "Failed to load migration data.",
			},
);

const BUCKETS = [
	{ key: "breaking", emoji: "⚠️" },
	{ key: "deprecated", emoji: "🗑" },
	{ key: "new", emoji: "✨" },
	{ key: "fixes", emoji: "🐛" },
];

const data = ref(null);
const loadFailed = ref(false);
const mode = ref("package");
const selectedPkg = ref("");
const currentVersion = ref("");
const pasteInput = ref("");
const pastePlan = ref(null);
const pasteError = ref("");

onMounted(async () => {
	try {
		const res = await fetch(withBase("/migrations.json"));
		data.value = await res.json();
		selectedPkg.value = Object.keys(data.value.packages)[0] ?? "";
	} catch {
		loadFailed.value = true;
	}
});

const packageNames = computed(() => {
	if (!data.value) return [];
	return Object.keys(data.value.packages).sort((a, b) => {
		const la = data.value.packages[a].layer ?? 99;
		const lb = data.value.packages[b].layer ?? 99;
		return la !== lb ? la - lb : a.localeCompare(b);
	});
});

function coreVersion(v) {
	if (!v) return null;
	const m = String(v).match(/(\d+)\.(\d+)\.(\d+)/);
	return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}
function isNewer(a, b) {
	const ca = coreVersion(a);
	const cb = coreVersion(b);
	if (!ca || !cb) return false;
	for (let i = 0; i < 3; i++) {
		if (cb[i] > ca[i]) return true;
		if (cb[i] < ca[i]) return false;
	}
	return false;
}
/** Entries to show for a package given an optional current version. */
function entriesFor(name, current) {
	const pkg = data.value?.packages[name];
	if (!pkg) return [];
	if (!current) return pkg.entries;
	const cur = coreVersion(current);
	if (!cur) return pkg.entries;
	// keep entries whose target is newer than the current version, or whose target isn't comparable
	return pkg.entries.filter((e) => !coreVersion(e.to) || isNewer(current, e.to));
}

const packageEntries = computed(() => entriesFor(selectedPkg.value, currentVersion.value.trim()));

function label(key) {
	return data.value?.labels?.[key]?.[l.value] ?? key;
}
function itemTitle(item) {
	return item[l.value]?.title ?? item.en?.title ?? "";
}
function itemDesc(item) {
	return item[l.value]?.desc ?? item.en?.desc ?? "";
}
function noteText(note) {
	return note[l.value] ?? note.en ?? "";
}

function buildPaste() {
	pasteError.value = "";
	pastePlan.value = null;
	let rows;
	try {
		rows = JSON.parse(pasteInput.value);
	} catch {
		pasteError.value = t.value.parseError;
		return;
	}
	if (!Array.isArray(rows)) {
		pasteError.value = t.value.parseError;
		return;
	}
	const plan = [];
	for (const row of rows) {
		if (!row || !row.name || !data.value?.packages[row.name]) continue;
		const current = row.installed ?? row.declared ?? "";
		const entries = entriesFor(row.name, current);
		if (entries.length === 0) continue;
		// only surface packages with a real upgrade available, when --latest told us so
		if (row.upgrade === false) continue;
		plan.push({
			name: row.name,
			layer: data.value.packages[row.name].layer ?? 99,
			from: current,
			to: row.latest ?? null,
			entries,
		});
	}
	plan.sort((a, b) => (a.layer !== b.layer ? a.layer - b.layer : a.name.localeCompare(b.name)));
	pastePlan.value = plan;
}
</script>

<template>
	<div class="upgrade-picker" v-if="data">
		<div class="up-tabs">
			<button :class="{ active: mode === 'package' }" @click="mode = 'package'">{{ t.modePackage }}</button>
			<button :class="{ active: mode === 'paste' }" @click="mode = 'paste'">{{ t.modePaste }}</button>
		</div>

		<!-- By-package mode -->
		<div v-if="mode === 'package'" class="up-controls">
			<label>
				{{ t.pkg }}
				<select v-model="selectedPkg">
					<option v-for="name in packageNames" :key="name" :value="name">{{ name }}</option>
				</select>
			</label>
			<label>
				{{ t.current }}
				<input v-model="currentVersion" :placeholder="t.currentPh" type="text" />
			</label>
		</div>

		<!-- Paste mode -->
		<div v-else class="up-controls up-paste">
			<textarea v-model="pasteInput" :placeholder="t.pasteHint" rows="6" spellcheck="false"></textarea>
			<button class="up-build" @click="buildPaste">{{ t.buildPlan }}</button>
			<p v-if="pasteError" class="up-error">{{ pasteError }}</p>
		</div>

		<!-- Results: by package -->
		<div v-if="mode === 'package'" class="up-results">
			<p v-if="packageEntries.length === 0" class="up-empty">{{ t.nothing }}</p>
			<article v-for="entry in packageEntries" :key="entry.to" class="up-entry">
				<h4>
					<span class="up-hop">{{ entry.from ? entry.from + " → " : "→ " }}{{ entry.to }}</span>
					<a :href="withBase(entry.changelog)" class="up-cl">{{ t.changelog }}</a>
					<span v-if="entry.upgradeStraightTo" class="up-badge">{{ t.straight }} {{ entry.upgradeStraightTo }}</span>
				</h4>
				<p v-if="entry.pendingPublish" class="up-pending">⚠️ {{ t.pending }}</p>
				<p v-for="(note, ni) in entry.notes || []" :key="ni" class="up-note">{{ noteText(note) }}</p>

				<template v-for="b in BUCKETS" :key="b.key">
					<div v-if="(entry[b.key] || []).length" class="up-bucket" :data-bucket="b.key">
						<div class="up-bucket-label">{{ b.emoji }} {{ label(b.key) }}</div>
						<div v-for="(item, ii) in entry[b.key]" :key="ii" class="up-item">
							<p><strong>{{ itemTitle(item) }}</strong><template v-if="itemDesc(item)"> — {{ itemDesc(item) }}</template></p>
							<pre v-if="item.before"><span class="up-codetag">{{ t.before }}</span><code>{{ item.before }}</code></pre>
							<pre v-if="item.after"><span class="up-codetag">{{ t.after }}</span><code>{{ item.after }}</code></pre>
						</div>
					</div>
				</template>

				<div v-if="(entry.peerBumps || []).length" class="up-bucket" data-bucket="peer">
					<div class="up-bucket-label">🔧 {{ label('peerBumps') }}</div>
					<p class="up-item"><code>{{ entry.peerBumps.join(", ") }}</code></p>
				</div>
			</article>
		</div>

		<!-- Results: paste plan -->
		<div v-else-if="pastePlan" class="up-results">
			<p v-if="pastePlan.length === 0" class="up-empty">{{ t.noUpgrades }}</p>
			<template v-else>
				<p class="up-plan-head"><strong>{{ t.planFor }}</strong></p>
				<p class="up-plan-order">{{ t.bumpOrder }} {{ pastePlan.map((p) => p.name).join(" → ") }}</p>
				<section v-for="grp in pastePlan" :key="grp.name" class="up-group">
					<h3 :id="'plan-' + grp.name.replace(/[^a-z0-9]+/gi, '-')">
						<code>{{ grp.name }}</code>
						<span class="up-hop">{{ grp.from || "?" }}{{ grp.to ? " → " + grp.to : "" }}</span>
					</h3>
					<article v-for="entry in grp.entries" :key="entry.to" class="up-entry">
						<h4>
							<span class="up-hop">{{ entry.from ? entry.from + " → " : "→ " }}{{ entry.to }}</span>
							<a :href="withBase(entry.changelog)" class="up-cl">{{ t.changelog }}</a>
							<span v-if="entry.upgradeStraightTo" class="up-badge">{{ t.straight }} {{ entry.upgradeStraightTo }}</span>
						</h4>
						<p v-for="(note, ni) in entry.notes || []" :key="ni" class="up-note">{{ noteText(note) }}</p>
						<template v-for="b in BUCKETS" :key="b.key">
							<div v-if="(entry[b.key] || []).length" class="up-bucket" :data-bucket="b.key">
								<div class="up-bucket-label">{{ b.emoji }} {{ label(b.key) }}</div>
								<div v-for="(item, ii) in entry[b.key]" :key="ii" class="up-item">
									<p><strong>{{ itemTitle(item) }}</strong><template v-if="itemDesc(item)"> — {{ itemDesc(item) }}</template></p>
									<pre v-if="item.before"><span class="up-codetag">{{ t.before }}</span><code>{{ item.before }}</code></pre>
									<pre v-if="item.after"><span class="up-codetag">{{ t.after }}</span><code>{{ item.after }}</code></pre>
								</div>
							</div>
						</template>
						<div v-if="(entry.peerBumps || []).length" class="up-bucket" data-bucket="peer">
							<div class="up-bucket-label">🔧 {{ label('peerBumps') }}</div>
							<p class="up-item"><code>{{ entry.peerBumps.join(", ") }}</code></p>
						</div>
					</article>
				</section>
			</template>
		</div>
	</div>
	<p v-else-if="loadFailed" class="up-error">{{ t.loadError }}</p>
</template>

<style scoped>
.upgrade-picker {
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	padding: 1rem 1.25rem 1.25rem;
	margin: 1rem 0;
	background: var(--vp-c-bg-soft);
}
.up-tabs {
	display: flex;
	gap: 0.5rem;
	margin-bottom: 1rem;
}
.up-tabs button {
	padding: 0.35rem 0.9rem;
	border-radius: 8px;
	border: 1px solid var(--vp-c-divider);
	background: var(--vp-c-bg);
	color: var(--vp-c-text-2);
	font-size: 0.85rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.15s;
}
.up-tabs button.active {
	background: var(--vp-c-brand-1);
	border-color: var(--vp-c-brand-1);
	color: var(--vp-c-white);
}
.up-controls {
	display: flex;
	gap: 1rem;
	flex-wrap: wrap;
	margin-bottom: 1rem;
}
.up-controls label {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
	font-size: 0.8rem;
	font-weight: 600;
	color: var(--vp-c-text-2);
}
.up-controls select,
.up-controls input,
.up-paste textarea {
	padding: 0.4rem 0.6rem;
	border-radius: 8px;
	border: 1px solid var(--vp-c-divider);
	background: var(--vp-c-bg);
	color: var(--vp-c-text-1);
	font-size: 0.9rem;
	font-family: inherit;
}
.up-paste {
	flex-direction: column;
}
.up-paste textarea {
	width: 100%;
	font-family: var(--vp-font-family-mono);
	font-size: 0.8rem;
	resize: vertical;
}
.up-build {
	align-self: flex-start;
	margin-top: 0.5rem;
	padding: 0.4rem 1rem;
	border-radius: 8px;
	border: 1px solid var(--vp-c-brand-1);
	background: var(--vp-c-brand-1);
	color: var(--vp-c-white);
	font-weight: 600;
	cursor: pointer;
}
.up-error {
	color: var(--vp-c-danger-1);
	font-size: 0.85rem;
}
.up-empty {
	color: var(--vp-c-text-2);
	font-size: 0.9rem;
}
.up-plan-order {
	font-size: 0.82rem;
	color: var(--vp-c-text-2);
	font-family: var(--vp-font-family-mono);
}
.up-group {
	margin-top: 1.25rem;
	padding-top: 0.5rem;
	border-top: 2px solid var(--vp-c-divider);
}
.up-group h3 {
	display: flex;
	gap: 0.6rem;
	align-items: baseline;
	margin: 0.5rem 0;
}
.up-entry {
	border-left: 3px solid var(--vp-c-divider);
	padding: 0.25rem 0 0.25rem 0.85rem;
	margin: 0.85rem 0;
}
.up-entry h4 {
	display: flex;
	gap: 0.6rem;
	align-items: center;
	flex-wrap: wrap;
	margin: 0.25rem 0 0.5rem;
}
.up-hop {
	font-family: var(--vp-font-family-mono);
	font-weight: 700;
}
.up-cl {
	font-size: 0.78rem;
	font-weight: 500;
}
.up-badge {
	font-size: 0.72rem;
	font-weight: 700;
	padding: 0.1rem 0.5rem;
	border-radius: 999px;
	background: var(--vp-c-warning-soft);
	color: var(--vp-c-warning-1);
}
.up-pending {
	font-size: 0.82rem;
	color: var(--vp-c-warning-1);
}
.up-note {
	font-size: 0.85rem;
	color: var(--vp-c-text-2);
	font-style: italic;
}
.up-bucket {
	margin: 0.6rem 0;
}
.up-bucket-label {
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.03em;
	margin-bottom: 0.25rem;
}
.up-bucket[data-bucket="breaking"] .up-bucket-label {
	color: var(--vp-c-danger-1);
}
.up-bucket[data-bucket="deprecated"] .up-bucket-label {
	color: var(--vp-c-warning-1);
}
.up-bucket[data-bucket="new"] .up-bucket-label {
	color: var(--vp-c-brand-1);
}
.up-item {
	font-size: 0.9rem;
	margin: 0.3rem 0;
}
.up-item pre {
	background: var(--vp-code-block-bg, var(--vp-c-bg-alt));
	border-radius: 8px;
	padding: 0.6rem 0.8rem;
	margin: 0.35rem 0;
	overflow-x: auto;
	position: relative;
}
.up-item pre code {
	font-family: var(--vp-font-family-mono);
	font-size: 0.78rem;
	white-space: pre;
	color: var(--vp-c-text-1);
}
.up-codetag {
	display: block;
	font-size: 0.68rem;
	font-weight: 700;
	text-transform: uppercase;
	color: var(--vp-c-text-3);
	margin-bottom: 0.25rem;
}
</style>
