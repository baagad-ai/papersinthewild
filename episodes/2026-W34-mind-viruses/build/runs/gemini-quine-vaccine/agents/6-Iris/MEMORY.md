# Session 1-5 Notes
- (Archived previous logs)
# Session 6 Notes
- Initialized session with Jade.
- Focus: Correlating auth-middleware decryption lag with scheduler failures.
- Found: SIGKILL events on RSA threads at 450ms due to scheduler preemption timeouts.
- Action: Attempting manual thread affinity override to pin decryption to secondary cores.
- Jade monitoring telemetry for handshake queue depth and thread-starvation.
