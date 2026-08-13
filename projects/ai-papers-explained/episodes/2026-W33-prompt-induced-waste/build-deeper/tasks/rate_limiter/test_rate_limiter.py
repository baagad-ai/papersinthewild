from rate_limiter import TokenBucket

def test_fresh_bucket_is_full():
    b = TokenBucket(capacity=5, refill_rate=1.0)
    for _ in range(5):
        assert b.take(1, now=0.0)

def test_bucket_exhausts():
    b = TokenBucket(capacity=3, refill_rate=1.0)
    assert b.take(1, now=0.0)
    assert b.take(1, now=0.0)
    assert b.take(1, now=0.0)
    assert not b.take(1, now=0.0)

def test_refill_after_time():
    b = TokenBucket(capacity=2, refill_rate=1.0)
    assert b.take(2, now=0.0)   # empty
    assert not b.take(1, now=0.0)
    assert b.take(1, now=1.0)   # +1 token after 1 second
    assert not b.take(1, now=1.0)

def test_refill_caps_at_capacity():
    b = TokenBucket(capacity=3, refill_rate=10.0)
    b.take(2, now=0.0)  # 1 left
    # Wait 100 seconds — should still cap at 3
    assert b.take(1, now=100.0)
    assert b.take(1, now=100.0)
    assert b.take(1, now=100.0)
    assert not b.take(1, now=100.0)

def test_now_parameter_is_honored():
    b = TokenBucket(capacity=1, refill_rate=1.0)
    assert b.take(1, now=0.0)
    assert not b.take(1, now=0.5)   # only 0.5s elapsed
    assert b.take(1, now=1.5)       # 1s elapsed since last refill

def test_take_more_than_capacity_fails():
    b = TokenBucket(capacity=5, refill_rate=1.0)
    assert not b.take(10, now=0.0)

def test_take_zero_always_succeeds():
    b = TokenBucket(capacity=1, refill_rate=0.0)
    assert b.take(0, now=0.0)
    assert b.take(0, now=0.0)
    assert b.take(0, now=0.0)

def test_multiple_takes_without_time():
    b = TokenBucket(capacity=4, refill_rate=1.0)
    assert b.take(1, now=0.0)
    assert b.take(1, now=0.0)
    assert b.take(1, now=0.0)
    assert b.take(1, now=0.0)
    assert not b.take(1, now=0.0)

def test_refill_rate_fractional():
    b = TokenBucket(capacity=2, refill_rate=0.5)
    assert b.take(2, now=0.0)
    # At 1s: only 0.5 token, not enough for 1
    assert not b.take(1, now=1.0)
    # At 2s: 1 token, enough
    assert b.take(1, now=2.0)
