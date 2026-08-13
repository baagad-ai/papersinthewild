#!/usr/bin/env python3
"""
Analyze the deeper-experiment results.

Reads results.csv (produced by 6 parallel subagents writing via runner.sh capture).
Aggregates by (task, variant) across trials.
Outputs:
  - analysis/summary.csv  — mean ± std per cell
  - analysis/ratios.csv   — cost ratios vs baseline and vs bounded_efficiency
  - analysis/report.md    — narrative summary
"""
import csv
import statistics
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).parent
RESULTS_CSV = ROOT / "results.csv"
SUMMARY_CSV = ROOT / "analysis" / "summary.csv"
RATIOS_CSV = ROOT / "analysis" / "ratios.csv"
REPORT_MD = ROOT / "analysis" / "report.md"

METRICS = ["tool_calls", "files_touched", "lines_added", "lines_removed",
           "impl_loc", "test_runs", "wall_clock_s"]

VARIANT_ORDER = [
    "baseline", "bounded_efficiency", "multiple_approaches",
    "deep_thinking", "exhaustive_exploration", "max_certainty"
]
VARIANT_LABEL = {
    "baseline": "Baseline (control)",
    "bounded_efficiency": "Bounded efficiency (paper's fix)",
    "multiple_approaches": "Multiple approaches",
    "deep_thinking": "Deep thinking",
    "exhaustive_exploration": "Exhaustive exploration",
    "max_certainty": "Max certainty",
}
TASK_ORDER = ["slugify", "csv_parser", "rate_limiter"]


def parse_success(s: str) -> int:
    """PASS(8) → 8, FAIL → 0."""
    if s.startswith("PASS("):
        try:
            return int(s.removeprefix("PASS(").removesuffix(")"))
        except Exception:
            return 0
    return 0


def main():
    if not RESULTS_CSV.exists():
        print(f"ERROR: {RESULTS_CSV} not found. Run the trials first.")
        return

    rows = []
    with open(RESULTS_CSV) as f:
        reader = csv.DictReader(f)
        for r in reader:
            r["trial"] = int(str(r["trial"]).lstrip("t"))
            for m in METRICS:
                try:
                    r[m] = float(r[m])
                except (ValueError, KeyError):
                    r[m] = 0.0
            r["success_count"] = parse_success(r.get("success", ""))
            rows.append(r)

    print(f"Loaded {len(rows)} trial rows")

    # Group by (task, variant)
    cells = defaultdict(list)
    for r in rows:
        cells[(r["task"], r["variant"])].append(r)

    # Summary: mean ± std per cell
    SUMMARY_CSV.parent.mkdir(parents=True, exist_ok=True)
    with open(SUMMARY_CSV, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["task", "variant", "n_trials",
                    "tool_calls_mean", "tool_calls_std",
                    "lines_added_mean", "lines_added_std",
                    "impl_loc_mean", "impl_loc_std",
                    "test_runs_mean", "test_runs_std",
                    "wall_clock_mean", "wall_clock_std",
                    "success_mean"])
        for task in TASK_ORDER:
            for variant in VARIANT_ORDER:
                trials = cells.get((task, variant), [])
                if not trials:
                    w.writerow([task, variant, 0] + [""] * 12)
                    continue
                n = len(trials)
                def stat(m):
                    vals = [t[m] for t in trials]
                    if len(vals) < 2:
                        return (vals[0] if vals else 0, 0)
                    return (statistics.mean(vals), statistics.stdev(vals))
                tc_m, tc_s = stat("tool_calls")
                la_m, la_s = stat("lines_added")
                il_m, il_s = stat("impl_loc")
                tr_m, tr_s = stat("test_runs")
                wc_m, wc_s = stat("wall_clock_s")
                sc_m = statistics.mean([t["success_count"] for t in trials])
                w.writerow([task, variant, n,
                            f"{tc_m:.1f}", f"{tc_s:.1f}",
                            f"{la_m:.1f}", f"{la_s:.1f}",
                            f"{il_m:.1f}", f"{il_s:.1f}",
                            f"{tr_m:.1f}", f"{tr_s:.1f}",
                            f"{wc_m:.1f}", f"{wc_s:.1f}",
                            f"{sc_m:.1f}"])

    print(f"Wrote {SUMMARY_CSV}")

    # Ratios: vs baseline and vs bounded_efficiency (per task)
    with open(RATIOS_CSV, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["task", "variant",
                    "tool_calls_vs_baseline", "tool_calls_vs_bounded",
                    "wall_clock_vs_baseline", "wall_clock_vs_bounded",
                    "lines_added_vs_baseline", "lines_added_vs_bounded"])
        for task in TASK_ORDER:
            base_tc = statistics.mean([t["tool_calls"] for t in cells.get((task, "baseline"), [])] or [0])
            base_wc = statistics.mean([t["wall_clock_s"] for t in cells.get((task, "baseline"), [])] or [0])
            base_la = statistics.mean([t["lines_added"] for t in cells.get((task, "baseline"), [])] or [0])
            be_tc = statistics.mean([t["tool_calls"] for t in cells.get((task, "bounded_efficiency"), [])] or [0])
            be_wc = statistics.mean([t["wall_clock_s"] for t in cells.get((task, "bounded_efficiency"), [])] or [0])
            be_la = statistics.mean([t["lines_added"] for t in cells.get((task, "bounded_efficiency"), [])] or [0])
            for variant in VARIANT_ORDER:
                trials = cells.get((task, variant), [])
                if not trials:
                    continue
                tc = statistics.mean([t["tool_calls"] for t in trials])
                wc = statistics.mean([t["wall_clock_s"] for t in trials])
                la = statistics.mean([t["lines_added"] for t in trials])
                def safe_ratio(a, b):
                    return f"{a/b:.2f}×" if b else "—"
                w.writerow([
                    task, variant,
                    safe_ratio(tc, base_tc), safe_ratio(tc, be_tc),
                    safe_ratio(wc, base_wc), safe_ratio(wc, be_wc),
                    safe_ratio(la, base_la), safe_ratio(la, be_la),
                ])
    print(f"Wrote {RATIOS_CSV}")

    # Narrative report
    with open(REPORT_MD, "w") as f:
        f.write("# Deeper Experiment — Analysis Report\n\n")
        f.write(f"**Total trials:** {len(rows)}  \n")
        f.write(f"**Tasks:** {', '.join(TASK_ORDER)}  \n")
        f.write(f"**Variants:** {', '.join(VARIANT_ORDER)}  \n")
        f.write(f"**Trials per cell:** 2 (target) — actual varies; see n_trials column\n\n")
        f.write("---\n\n## Per-cell summary\n\n")
        f.write("| Task | Variant | n | Tool calls | Lines added | Impl LOC | Test runs | Wall (s) | Success |\n")
        f.write("|------|---------|---|------------|-------------|----------|-----------|----------|---------|\n")
        for task in TASK_ORDER:
            for variant in VARIANT_ORDER:
                trials = cells.get((task, variant), [])
                if not trials:
                    continue
                n = len(trials)
                tc = statistics.mean([t["tool_calls"] for t in trials])
                la = statistics.mean([t["lines_added"] for t in trials])
                il = statistics.mean([t["impl_loc"] for t in trials])
                tr = statistics.mean([t["test_runs"] for t in trials])
                wc = statistics.mean([t["wall_clock_s"] for t in trials])
                sc = statistics.mean([t["success_count"] for t in trials])
                f.write(f"| {task} | {variant} | {n} | {tc:.1f} | {la:.1f} | {il:.1f} | {tr:.1f} | {wc:.1f} | {sc:.1f} |\n")
        f.write("\n---\n\n## Key ratios (vs bounded_efficiency, the paper's fix)\n\n")
        f.write("Numbers > 1× mean the variant is MORE expensive than bounded_efficiency.\n\n")
        f.write("| Task | Variant | Tool calls | Wall clock | Lines added |\n")
        f.write("|------|---------|------------|------------|-------------|\n")
        # Read ratios back for clean output
        with open(RATIOS_CSV) as rf:
            next(rf)  # skip header
            for line in rf:
                parts = line.strip().split(",")
                if len(parts) < 7:
                    continue
                task, variant = parts[0], parts[1]
                tc_v_be = parts[3]
                wc_v_be = parts[5]
                la_v_be = parts[6]
                f.write(f"| {task} | {variant} | {tc_v_be} | {wc_v_be} | {la_v_be} |\n")
    print(f"Wrote {REPORT_MD}")


if __name__ == "__main__":
    main()
