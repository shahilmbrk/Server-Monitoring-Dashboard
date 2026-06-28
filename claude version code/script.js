/**
 * SysWatch — Dashboard Script
 * Handles: live clock, metric badge coloring, progress bar warning states
 * No backend logic — purely UI enhancement layer.
 */

/* ═══════════════════════════════════════════════════
   LIVE CLOCK
   ═══════════════════════════════════════════════════ */

function updateClock() {
    const now = new Date();

    // Time: HH:MM:SS
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const timeEl = document.getElementById('live-time');
    if (timeEl) timeEl.textContent = `${h}:${m}:${s}`;

    // Date: Mon 01 Jan 2025
    const dateEl = document.getElementById('live-date');
    if (dateEl) {
        const opts = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-GB', opts).replace(/,/g, '');
    }
}

updateClock();
setInterval(updateClock, 1000);

/* ═══════════════════════════════════════════════════
   METRIC BADGE LOGIC
   Reads the current % from the DOM and assigns
   the correct color badge label.
   ═══════════════════════════════════════════════════ */

function getLevel(pct) {
    if (pct >= 90) return { label: 'CRITICAL', cls: 'card-badge--danger', statusText: '⚠ Critical' };
    if (pct >= 75) return { label: 'HIGH', cls: 'card-badge--warn', statusText: '↑ Elevated' };
    if (pct >= 50) return { label: 'MODERATE', cls: 'card-badge--ok', statusText: '◑ Moderate' };
    return { label: 'NORMAL', cls: 'card-badge--ok', statusText: '✓ Normal' };
}

function applyBadge(badgeId, statusId, barId, pct) {
    const badge = document.getElementById(badgeId);
    const status = document.getElementById(statusId);
    const bar = document.getElementById(barId);
    if (!badge) return;

    const level = getLevel(pct);

    // Clear previous state classes
    badge.classList.remove('card-badge--ok', 'card-badge--warn', 'card-badge--danger');
    badge.classList.add(level.cls);
    badge.textContent = level.label;

    if (status) {
        status.textContent = level.statusText;
        status.style.color = level.cls === 'card-badge--danger'
            ? 'var(--color-danger)'
            : level.cls === 'card-badge--warn'
                ? 'var(--color-warn)'
                : 'var(--color-ok)';
    }

    // Tint the progress fill red when critical
    if (bar && pct >= 90) {
        bar.style.background = 'linear-gradient(90deg, #dc2626, #f87171)';
    }
}

/* Extract numeric value from the metric-value element text */
function readMetricPct(cardSelector) {
    const card = document.querySelector(`[data-metric="${cardSelector}"]`);
    if (!card) return 0;
    const valEl = card.querySelector('.metric-value');
    if (!valEl) return 0;
    // Strip unit span text, keep only the number
    const raw = valEl.childNodes[0]?.textContent?.trim() || '0';
    return parseFloat(raw) || 0;
}

function initBadges() {
    const cpuPct = readMetricPct('cpu');
    const ramPct = readMetricPct('ram');
    const diskPct = readMetricPct('disk');

    applyBadge('cpu-badge', 'cpu-status', 'cpu-bar', cpuPct);
    applyBadge('ram-badge', 'ram-status', 'ram-bar', ramPct);
    applyBadge('disk-badge', 'disk-status', 'disk-bar', diskPct);
}

/* ═══════════════════════════════════════════════════
   PROCESS COUNT PILL
   ═══════════════════════════════════════════════════ */

function updateProcessCount() {
    const rows = document.querySelectorAll('#process-tbody .process-row');
    const pill = document.getElementById('process-count');
    if (pill && rows.length) {
        pill.textContent = `${rows.length} process${rows.length === 1 ? '' : 'es'}`;
    }
}

/* ═══════════════════════════════════════════════════
   LAST REFRESH TIME
   ═══════════════════════════════════════════════════ */

function setLastRefresh() {
    const el = document.getElementById('last-refresh-time');
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    el.textContent = `${h}:${m}:${s}`;
}

/* ═══════════════════════════════════════════════════
   REFRESH BUTTON SPIN ANIMATION
   ═══════════════════════════════════════════════════ */

function bindRefreshBtn() {
    const btn = document.querySelector('.refresh-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.style.transition = 'transform 0.6s ease';
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transition = '';
                icon.style.transform = '';
            }, 650);
        }
    });
}

/* ═══════════════════════════════════════════════════
   PROGRESS BAR SHIMMER ON HOVER
   ═══════════════════════════════════════════════════ */

function bindProgressHover() {
    document.querySelectorAll('.card--metric').forEach(card => {
        const bar = card.querySelector('.progress-fill');
        if (!bar) return;
        card.addEventListener('mouseenter', () => {
            bar.style.filter = 'brightness(1.2)';
        });
        card.addEventListener('mouseleave', () => {
            bar.style.filter = '';
        });
    });
}

/* ═══════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initBadges();
    updateProcessCount();
    setLastRefresh();
    bindRefreshBtn();
    bindProgressHover();
});