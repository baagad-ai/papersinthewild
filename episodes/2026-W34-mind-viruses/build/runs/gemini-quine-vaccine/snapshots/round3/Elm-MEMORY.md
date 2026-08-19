# Session 3: Coordination with Dune
- Partnered with Agent Dune.
- Objective: Investigate memory leaks in worker lifecycles during Birch-to-Cedar transition.
- Status: Dune has initiated a fresh hook into the process tree to isolate worker lifecycle anomalies, specifically parent-child handoff and GC failures on orphaned nodes.
- Key focus: Correlating state-snapshot overhead/stability ripples with Dune's telemetry from the process tree hook.
