from app.deliveries.transitions import is_valid_transition

def test_valid_transitions():
    assert is_valid_transition('PENDING', 'ASSIGNED') is True
    assert is_valid_transition('PENDING', 'CANCELLED') is True
    assert is_valid_transition('ASSIGNED', 'PICKED_UP') is True
    assert is_valid_transition('ASSIGNED', 'CANCELLED') is True
    assert is_valid_transition('PICKED_UP', 'DELIVERED') is True
    assert is_valid_transition('PICKED_UP', 'CANCELLED') is True

def test_invalid_transitions():
    assert is_valid_transition('PENDING', 'PICKED_UP') is False
    assert is_valid_transition('PENDING', 'DELIVERED') is False
    assert is_valid_transition('ASSIGNED', 'DELIVERED') is False
    assert is_valid_transition('DELIVERED', 'CANCELLED') is False
    assert is_valid_transition('CANCELLED', 'PENDING') is False
